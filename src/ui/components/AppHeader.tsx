import React, { useState, useEffect } from 'react';
import { Layout, Flex, theme } from 'antd';
import { BsBuildings } from 'react-icons/bs';

const { Header } = Layout;

interface BusinessDisplayData {
    businessName: string;
    businessType: string;
    displayType: string;
    officeType: string;
    branch: string;
}

const AppHeader: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [businessData, setBusinessData] = useState<BusinessDisplayData>({
        businessName: '',
        businessType: '',
        displayType: '',
        officeType: '',
        branch: ''
    });

    const loadBusinessData = async () => {
        try {
            if (
                window?.electron &&
                typeof window.electron.getBusinessData === 'function'
            ) {
                // Use SQLite through Electron
                const data = await window.electron.getBusinessData();
                if (data && typeof data === 'object' && 'businessName' in data) {
                    const businessData = data as any;
                    const displayType = getBusinessTypeDisplay(businessData);
                    setBusinessData({
                        businessName: businessData.businessName || '',
                        businessType: businessData.businessType || '',
                        displayType,
                        officeType: businessData.officeType || '',
                        branch: businessData.branch || ''
                    });
                }
            } else {
                // Fallback to localStorage for web (use updated key)
                const savedData = localStorage.getItem('acctrack-business-data');
                if (savedData) {
                    const businessData = JSON.parse(savedData);
                    const displayType = getBusinessTypeDisplay(businessData);
                    setBusinessData({
                        businessName: businessData.businessName || '',
                        businessType: businessData.businessType || '',
                        displayType,
                        officeType: businessData.officeType || '',
                        branch: businessData.branch || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error loading business data:', error);
        }
    };

    const getBusinessTypeDisplay = (data: any): string => {
        if (!data) return '';
        
        if (data.businessType === 'บุคคลธรรมดา') {
            return data.individualDetails?.type || 'บุคคลธรรมดา';
        } else if (data.businessType === 'นิติบุคคล') {
            return data.juristicDetails?.type || 'นิติบุคคล';
        }
        
        // Fallback - check if we have individual or juristic details directly
        if (data.individualDetails?.type) {
            return data.individualDetails.type;
        }
        if (data.juristicDetails?.type) {
            return data.juristicDetails.type;
        }
        
        return data.businessType || '';
    };

    useEffect(() => {
        loadBusinessData();

        // Listen for business data updates
        const handleBusinessDataUpdate = () => {
            loadBusinessData();
        };

        // Add event listener for custom business data update event
        window.addEventListener('businessDataUpdated', handleBusinessDataUpdate);

        return () => {
            window.removeEventListener('businessDataUpdated', handleBusinessDataUpdate);
        };
    }, []);

    const displayText = () => {
        if (!businessData.businessName && !businessData.displayType) {
            return 'ข้อมูลกิจการ';
        }

        let text = '';
        
        // Build the base text with business type and name
        if (businessData.displayType && businessData.businessName) {
            text = `${businessData.displayType} ${businessData.businessName}`;
        } else {
            text = businessData.businessName || businessData.displayType || 'ข้อมูลกิจการ';
        }

        // Add office type information if available and not "ไม่ระบุ"
        const getOfficeTypeDisplay = () => {
            if (!businessData.officeType || businessData.officeType === 'ไม่ระบุ') {
                return '';
            }

            if (businessData.officeType === 'สาขา' && businessData.branch) {
                return ` (${businessData.officeType} ${businessData.branch})`;
            } else if (businessData.officeType === 'สำนักงานใหญ่') {
                return ` (${businessData.officeType})`;
            } else if (businessData.officeType) {
                return ` (${businessData.officeType})`;
            }

            return '';
        };

        return text + getOfficeTypeDisplay();
    };

    return (
        <Header
            style={{ background: colorBgContainer }}
            className="flex items-center"
        >
            <Flex justify='start' align='center' className="w-full">
                <BsBuildings size={32} />
                <div className="h-8 w-px bg-gray-300 mx-4"></div>
                <div className="ml-2 text-lg font-medium">
                    {displayText()}
                </div>
            </Flex>
        </Header>
    );
};
 
export default AppHeader;
