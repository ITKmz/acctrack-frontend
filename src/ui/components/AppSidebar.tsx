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
            style={{
                background: colorBgContainer,
            }}
            className="h-screen"
        >
            <div className="flex items-center justify-center py-4">
                <h1 className="text-2xl font-bold">AccTrack</h1>
            </div>
            <Menu
                mode="vertical"
                triggerSubMenuAction="hover"
                onClick={({ key }) => {
                    // Always navigate when clicking on any menu item
                    navigate(`/${key}`);
                }}
                defaultSelectedKeys={['home']}
                style={{ height: '100%', borderRight: 0 }}
                items={items}
                className="flex flex-col gap-4"
            />
        </Sider>
    );
};

export default AppSidebar;