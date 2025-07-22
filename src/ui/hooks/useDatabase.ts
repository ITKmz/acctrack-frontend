import { useState, useEffect } from 'react';

// Local type definitions (matching the ones in renderer.d.ts)
export interface BusinessData {
    id?: string;
    businessType: string;
    registrationNumber: string;
    officeType: string;
    branch?: string;
    individualDetails: {
        type: string;
    };
    juristicDetails: {
        type: string;
    };
    businessName: string;
    businessDescription: string;
    registrationDate: string;
    vatRegistered: boolean;
    vatDetails: {
        vatRegistrationDate?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductData {
    id?: string;
    name: string;
    description?: string;
    category?: string;
    unitPrice: number;
    stock: number;
    minStock: number;
    createdAt?: string;
    updatedAt?: string;
}

// Database service for interacting with SQLite through Electron
export const useDatabase = () => {
    const [isElectron, setIsElectron] = useState(false);

    useEffect(() => {
        // Detect if we're in an Electron environment
        if (window?.electron) {
            setIsElectron(true);
        }
    }, []);

    // Business Data Operations
    const saveBusinessData = async (data: BusinessData) => {
        if (isElectron && window.electron.saveBusinessData) {
            return await window.electron.saveBusinessData(data);
        } else {
            // Fallback to localStorage
            localStorage.setItem('acctrack-business-data', JSON.stringify(data));
            return { success: true };
        }
    };

    const getBusinessData = async (): Promise<BusinessData | null> => {
        if (isElectron && window.electron.getBusinessData) {
            const result = await window.electron.getBusinessData();
            if (result && Object.keys(result).length > 0) {
                return result as BusinessData;
            }
            return null;
        } else {
            // Fallback to localStorage
            const saved = localStorage.getItem('acctrack-business-data');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return null;
                }
            }
            return null;
        }
    };

    return {
        isElectron,
        // Business data
        saveBusinessData,
        getBusinessData,
    };
};

// Hook for business data specifically
export const useBusinessData = () => {
    const [businessData, setBusinessData] = useState<BusinessData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { saveBusinessData: save, getBusinessData: get } = useDatabase();

    const loadBusinessData = async () => {
        try {
            setLoading(true);
            const data = await get();
            setBusinessData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load business data');
        } finally {
            setLoading(false);
        }
    };

    const saveBusinessDataState = async (data: BusinessData) => {
        try {
            const result = await save(data);
            if (result.success) {
                setBusinessData(data);
                setError(null);
                return result;
            } else {
                setError((result as any).error || 'Failed to save business data');
                return result;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save business data';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    useEffect(() => {
        loadBusinessData();
    }, []);

    return {
        businessData,
        loading,
        error,
        saveBusinessData: saveBusinessDataState,
        refreshBusinessData: loadBusinessData,
    };
};
