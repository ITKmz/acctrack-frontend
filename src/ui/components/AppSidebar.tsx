import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    HomeOutlined,
    DollarCircleOutlined,
    BoxPlotOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const items: MenuProps['items'] = [
    {
        key: 'home',
        icon: <HomeOutlined className="text-[32px]" />,
        label: <span className="text-base">หน้าแรก</span>, // Home
    },
    {
        key: 'income',
        icon: <DollarCircleOutlined className="text-[32px]" />,
        label: <span className="text-base">รายรับ</span>, // Income
    },
    {
        key: 'expenses',
        icon: <FileTextOutlined className="text-[32px]" />,
        label: <span className="text-base">รายจ่าย</span>, // Expenses
    },
    {
        key: 'products',
        icon: <BoxPlotOutlined className="text-[32px]" />,
        label: <span className="text-base">สินค้า</span>, // Products
    },
];

const bottomItems: MenuProps['items'] = [
    {
        key: 'settings',
        icon: <SettingOutlined className="text-[32px]" />,
        label: <span className="text-base">ตั้งค่า</span>, // Settings
    },
];

const AppSidebar: React.FC = () => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Sider
            width={200}
            style={{ background: colorBgContainer }}
            className="fixed left-0 top-0 z-10 p-0"
        >
            <div className="h-screen flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-center py-4 flex-shrink-0">
                    <h1 className="text-2xl font-bold">AccTrack</h1>
                </div>

                {/* Content with two Menus */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                    {/* Top Menu */}
                    <Menu
                        mode="vertical"
                        triggerSubMenuAction="hover"
                        onClick={({ key }) => navigate(`/${key}`)}
                        defaultSelectedKeys={['home']}
                        className="flex flex-col gap-4"
                        items={items}
                    />

                    {/* Bottom Menu */}
                    <Menu
                        mode="vertical"
                        triggerSubMenuAction="hover"
                        onClick={({ key }) => navigate(`/${key}`)}
                        style={{
                            borderTop: '1px solid #f0f0f0',
                            borderRight: 0,
                            padding: '16px 0',
                        }}
                        items={bottomItems}
                    />
                </div>
            </div>
        </Sider>
    );
};

export default AppSidebar;
