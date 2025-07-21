import React, { useState, useEffect } from 'react';
import { Layout, Flex, theme } from 'antd';
import { BsBuildings } from 'react-icons/bs';

const { Header } = Layout;

const AppHeader: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [businessName, setBusinessName] = useState<string>('');

    useEffect(() => {
        const loadBusinessData = async () => {
            try {
                if (
                    window?.electron &&
                    typeof window.electron.getBusinessData === 'function'
                ) {
                    // Use SQLite through Electron
                    const businessData = await window.electron.getBusinessData();
                    if (businessData && typeof businessData === 'object' && 'businessName' in businessData) {
                        setBusinessName(businessData.businessName || '');
                    }
                } else {
                    // Fallback to localStorage for web
                    const savedData = localStorage.getItem('businessData');
                    if (savedData) {
                        const businessData = JSON.parse(savedData);
                        setBusinessName(businessData.businessName || '');
                    }
                }
            } catch (error) {
                console.error('Error loading business data:', error);
            }
        };

        loadBusinessData();
    }, []);

    return (
        <Header
            style={{ background: colorBgContainer }}
            className="flex items-center"
        >
            <Flex justify='start' align='center' className="w-full">
                <BsBuildings size={32} />
                <div className="h-8 w-px bg-gray-300 mx-4"></div>
                <div className="ml-2 text-lg font-medium">
                    {businessName || 'ข้อมูลกิจการ'}
                </div>
            </Flex>
        </Header>
    );
};
 
export default AppHeader;
