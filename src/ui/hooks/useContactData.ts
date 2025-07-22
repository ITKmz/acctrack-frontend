import { useState, useEffect } from 'react';
import { ContactAddressData } from '../../types/renderer';

export const useContactData = () => {
    const [contactData, setContactData] = useState<ContactAddressData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Load contact data on mount
    useEffect(() => {
        loadContactData();
    }, []);

    const loadContactData = async () => {
        setLoading(true);
        setError('');
        
        try {
            if (window?.electron?.getContactData) {
                // Running in Electron
                const result = await window.electron.getContactData();
                if (result.success) {
                    setContactData(result.data || null);
                } else {
                    setError(result.error || 'ไม่สามารถโหลดข้อมูลติดต่อได้');
                }
            } else {
                // Running in browser - check localStorage
                const saved = localStorage.getItem('acctrack-contact-data');
                if (saved) {
                    const data = JSON.parse(saved);
                    setContactData(data);
                } else {
                    setContactData(null);
                }
            }
        } catch (err) {
            console.error('Error loading contact data:', err);
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูลติดต่อ');
        } finally {
            setLoading(false);
        }
    };

    const saveContactData = async (data: ContactAddressData) => {
        try {
            const dataWithTimestamp = {
                ...data,
                updatedAt: new Date().toISOString(),
                createdAt: contactData?.createdAt || new Date().toISOString(),
            };

            if (window?.electron?.saveContactData) {
                // Running in Electron
                const result = await window.electron.saveContactData(dataWithTimestamp);
                if (result.success) {
                    setContactData(dataWithTimestamp);
                    return { success: true };
                } else {
                    return { success: false, error: result.error || 'ไม่สามารถบันทึกข้อมูลได้' };
                }
            } else {
                // Running in browser - save to localStorage
                localStorage.setItem('acctrack-contact-data', JSON.stringify(dataWithTimestamp));
                setContactData(dataWithTimestamp);
                return { success: true };
            }
        } catch (err) {
            console.error('Error saving contact data:', err);
            return { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' };
        }
    };

    const clearContactData = async () => {
        try {
            // Clear from localStorage if in browser mode
            if (!window?.electron) {
                localStorage.removeItem('acctrack-contact-data');
            }
            
            setContactData(null);
            return { success: true };
        } catch (err) {
            console.error('Error clearing contact data:', err);
            return { success: false, error: 'เกิดข้อผิดพลาดในการลบข้อมูล' };
        }
    };

    return {
        contactData,
        loading,
        error,
        saveContactData,
        loadContactData,
        clearContactData,
    };
};
