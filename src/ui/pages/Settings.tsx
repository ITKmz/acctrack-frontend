import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import DefaultLayout from '@/layouts/default';
import BusinessForm from '@/components/settings/BusinessForm';

const { Sider, Content } = Layout;

export default function SettingsPage() {
    const [selectedMenu, setSelectedMenu] = useState('business'); // Default to 'business'
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const renderContent = () => {
        switch (selectedMenu) {
            case 'business':
                return <BusinessForm />;
            // Add more cases for other settings pages here
            default:
                return <div>กรุณาเลือกเมนู</div>; // "Please select a menu"
        }
    };

    return (
        <DefaultLayout>
            <Layout className="min-h-screen">
                <Layout style={{ background: colorBgContainer }}>
                    <Sider
                        width={200}
                        className="bg-white border-r border-gray-200"
                        style={{ background: colorBgContainer }}
                    >
                        <h1 className="text-2xl font-bold p-4 bg-white">
                            ตั้งค่า
                        </h1>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['business']}
                            onClick={({ key }) => setSelectedMenu(key)}
                            items={[
                                { key: 'business', label: 'ข้อมูลกิจการ' }, // Business Info
                                { key: 'other', label: 'ตั้งค่าอื่น ๆ' }, // Other Settings
                            ]}
                        />
                    </Sider>
                    {renderContent()}
                </Layout>
            </Layout>
        </DefaultLayout>
    );
}
