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
        children: [
            {
                key: 'income/quotations',
                label: <span className="text-sm">ใบเสนอราคา</span>, // Quotation
            },
            {
                key: 'income/invoices',
                label: <span className="text-sm">ใบแจ้งหนี้</span>, // Invoice
            },
        ],
    },
    {
        key: 'expenses',
        icon: <FileTextOutlined className="text-[32px]" />,
        label: <span className="text-base">รายจ่าย</span>, // Expenses
        children: [
            {
                key: 'expenses/purchase-orders',
                label: <span className="text-sm">ใบสั่งซื้อ</span>, // Purchase Order
            },
        ],
    },
    {
        key: 'products',
        icon: <BoxPlotOutlined className="text-[32px]" />,
        label: <span className="text-base">สินค้า</span>, // Products
        children: [
            {
                key: 'products/list',
                label: <span className="text-sm">รายการสินค้า</span>, // Product List
            },
            {
                key: 'products/categories',
                label: <span className="text-sm">หมวดหมู่สินค้า</span>, // Product Categories
            },
        ],
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