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
        <Layout>
            <AppSidebar />
            <Layout>
                <AppHeader />
                <Layout className="px-6 pb-6">
                    <Content className="p-6 mt-6 min-h-[280px] bg-white rounded-lg">
                        {children}
                    </Content>
                    <AppFooter />
                </Layout>
            </Layout>
        </Layout>
    );
}
