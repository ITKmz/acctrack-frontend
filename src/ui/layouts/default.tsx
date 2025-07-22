import React from 'react';
import { Layout } from 'antd';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import AppFooter from '@/components/AppFooter';

const { Content } = Layout;

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Layout className="h-screen">
            <AppSidebar />
            <Layout className="flex flex-col">
                <AppHeader />
                <Content className="flex-1 overflow-auto px-6 pb-6 inset-shadow-sm">
                    <div className="p-6 mt-6 min-h-[280px] bg-white rounded-lg shadow-md">
                        {children}
                    </div>
                    <AppFooter />
                </Content>
            </Layout>
        </Layout>
    );
}
