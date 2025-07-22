import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
    return (
        <Footer className="text-center bg-gray-100 py-4 mt-2">
            AccTrack ©2025 Created by Ittikorn
        </Footer>
    );
};

export default AppFooter;
