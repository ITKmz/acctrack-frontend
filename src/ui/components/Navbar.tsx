import React from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const Navbar: React.FC = () => {
    return (
        <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div
                    className="logo"
                    style={{
                        float: 'left',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px',
                    }}
                >
                    Acctrack
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                >
                    <Menu.Item key="1">Home</Menu.Item>
                    <Menu.Item key="2">About</Menu.Item>
                    <Menu.Item key="3">Contact</Menu.Item>
                </Menu>
            </Header>
        </Layout>
    );
};

export default Navbar;
