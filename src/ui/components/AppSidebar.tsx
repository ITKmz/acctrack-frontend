import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    HomeOutlined,
    DollarCircleOutlined,
    ShoppingCartOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

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
        icon: <ShoppingCartOutlined className="text-[32px]" />,
        label: <span className="text-base">สินค้า</span>, // Products
    },
];

const AppSidebar: React.FC = () => {
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
                mode="inline"
                defaultSelectedKeys={['home']}
                style={{ height: '100%', borderRight: 0 }}
                items={items}
                className="flex flex-col gap-4"
            />
        </Sider>
    );
};

export default AppSidebar;