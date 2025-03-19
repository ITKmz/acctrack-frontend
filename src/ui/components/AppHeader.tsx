import React from 'react';
import { Layout, Flex, theme } from 'antd';
import { BsBuildings } from 'react-icons/bs';

const { Header } = Layout;

const AppHeader: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Header
            style={{ background: colorBgContainer }}
            className="flex items-center"
        >
            <Flex>
                <BsBuildings size={32}/>
                <div className="h-8 w-px bg-gray-300 mx-4"></div>
            </Flex>
        </Header>
    );
};

export default AppHeader;
