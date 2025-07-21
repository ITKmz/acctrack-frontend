import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Space, Input, Alert, Card, List } from 'antd';
import { FolderOpenOutlined, DatabaseOutlined, CheckCircleOutlined, PlusOutlined, HistoryOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface FirstTimeSetupProps {
    visible: boolean;
    onComplete: (selectedPath?: string) => void;
}

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ visible, onComplete }) => {
    const [selectedPath, setSelectedPath] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [existingDataInfo, setExistingDataInfo] = useState<{ hasData: boolean; tableCount?: number } | null>(null);
    const [recentFolders, setRecentFolders] = useState<string[]>([]);
    
    // Check if we're in development mode
    const isDevelopment = import.meta.env.DEV;

    useEffect(() => {
        // Load recent folders when component mounts
        loadRecentFolders();
    }, []);

    const loadRecentFolders = async () => {
        if (window?.electron?.getRecentFolders) {
            try {
                const recent = await window.electron.getRecentFolders();
                setRecentFolders(recent || []);
            } catch (error) {
                console.error('Error loading recent folders:', error);
            }
        }
    };

    const saveToRecentFolders = async (path: string) => {
        if (window?.electron?.addToRecentFolders) {
            try {
                await window.electron.addToRecentFolders(path);
            } catch (error) {
                console.error('Error saving to recent folders:', error);
            }
        }
    };

    const handleBrowseExistingFolder = async () => {
        if (window?.electron?.showOpenDialog) {
            const result = await window.electron.showOpenDialog({
                properties: ['openDirectory'],
                title: 'เลือกโฟลเดอร์ที่มีข้อมูล AccTrack อยู่แล้ว'
            });

            if (!result.canceled && result.filePaths.length > 0) {
                const path = result.filePaths[0];
                await selectFolder(path);
            }
        } else {
            alert('การเลือกโฟลเดอร์สามารถใช้ได้เฉพาะในโหมด Electron เท่านั้น');
        }
    };

    const handleCreateNewFolder = async () => {
        if (window?.electron?.showOpenDialog) {
            const result = await window.electron.showOpenDialog({
                properties: ['openDirectory'],
                title: 'เลือกตำแหน่งที่ต้องการสร้างโฟลเดอร์ใหม่สำหรับเก็บข้อมูล'
            });

            if (!result.canceled && result.filePaths.length > 0) {
                const path = result.filePaths[0];
                await selectFolder(path);
            }
        } else {
            alert('การเลือกโฟลเดอร์สามารถใช้ได้เฉพาะในโหมด Electron เท่านั้น');
        }
    };

    const selectFolder = async (path: string) => {
        setSelectedPath(path);
        
        // Check if folder contains existing data
        if (window?.electron?.checkFolderForExistingData) {
            try {
                const dataInfo = await window.electron.checkFolderForExistingData(path);
                setExistingDataInfo(dataInfo);
            } catch (error) {
                console.error('Error checking existing data:', error);
                setExistingDataInfo(null);
            }
        }
    };

    const handleSelectRecentFolder = async (path: string) => {
        await selectFolder(path);
    };

    const handleUseSelected = async () => {
        if (!selectedPath) {
            alert('กรุณาเลือกโฟลเดอร์ก่อน');
            return;
        }

        setLoading(true);
        try {
            // Save custom storage settings
            const customSettings = {
                storageType: 'sqlite' as const,
                autoBackup: true,
                backupInterval: 24,
                databasePath: selectedPath,
            };

            if (window?.electron?.saveStorageSettings) {
                await window.electron.saveStorageSettings(customSettings);
            }

            // Save to recent folders (ignore type errors for now)
            try {
                await saveToRecentFolders(selectedPath);
            } catch (error) {
                console.log('Could not save to recent folders:', error);
            }

            onComplete(selectedPath);
        } catch (error) {
            console.error('Error setting up storage:', error);
            alert('เกิดข้อผิดพลาดในการตั้งค่าตำแหน่งเก็บข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleUseDevMode = async () => {
        setLoading(true);
        try {
            // Save dev mode settings to localStorage
            const devSettings = {
                storageType: 'localStorage' as const,
                autoBackup: false,
                backupInterval: 0,
                databasePath: 'localStorage://dev',
                isDevelopment: true
            };

            // Save to localStorage for dev mode
            localStorage.setItem('acctrack-storage-settings', JSON.stringify(devSettings));
            localStorage.setItem('acctrack-setup-completed', 'true');
            
            console.log('Development mode activated - using localStorage');
            onComplete('localStorage://dev');
        } catch (error) {
            console.error('Error setting up dev mode:', error);
            alert('เกิดข้อผิดพลาดในการตั้งค่าโหมดพัฒนา');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={null}
            open={visible}
            footer={null}
            closable={false}
            maskClosable={false}
            width={700}
            centered
        >
            <div className="text-center mb-6">
                <DatabaseOutlined className="text-6xl text-blue-500 mb-4" />
                <Title level={2}>ยินดีต้อนรับสู่ AccTrack</Title>
                <Paragraph className="text-gray-600">
                    กรุณาเลือกตำแหน่งที่ต้องการเก็บข้อมูลของคุณ
                </Paragraph>
            </div>

            <Space direction="vertical" className="w-full mb-4" size="large">
                {/* Create New Folder Option */}
                <Card 
                    className="cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={handleCreateNewFolder}
                >
                    <div className="flex items-center space-x-4">
                        <PlusOutlined className="text-2xl text-green-500" />
                        <div className="flex-1">
                            <Text strong className="text-lg">สร้างโฟลเดอร์ใหม่</Text>
                            <br />
                            <Text type="secondary">
                                เลือกตำแหน่งและสร้างโฟลเดอร์ใหม่สำหรับเก็บข้อมูล AccTrack
                            </Text>
                        </div>
                    </div>
                </Card>

                {/* Open Existing Folder Option */}
                <Card 
                    className="cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={handleBrowseExistingFolder}
                >
                    <div className="flex items-center space-x-4">
                        <FolderOpenOutlined className="text-2xl text-blue-500" />
                        <div className="flex-1">
                            <Text strong className="text-lg">เปิดโฟลเดอร์ที่มีอยู่</Text>
                            <br />
                            <Text type="secondary">
                                เลือกโฟลเดอร์ที่มีข้อมูล AccTrack อยู่แล้ว หรือโฟลเดอร์ว่างสำหรับเริ่มต้นใหม่
                            </Text>
                        </div>
                    </div>
                </Card>

                {/* Development Mode Option - Only show in development */}
                {isDevelopment && (
                    <Card 
                        className="cursor-pointer hover:shadow-md transition-all duration-200 border-orange-200 bg-orange-50"
                        onClick={handleUseDevMode}
                    >
                        <div className="flex items-center space-x-4">
                            <DatabaseOutlined className="text-2xl text-orange-500" />
                            <div className="flex-1">
                                <Text strong className="text-lg">โหมดพัฒนา (Development)</Text>
                                <br />
                                <Text type="secondary">
                                    ใช้ localStorage สำหรับการพัฒนาและทดสอบ (ไม่ต้องเลือกโฟลเดอร์)
                                </Text>
                            </div>
                            <Button 
                                type="default"
                                style={{ borderColor: '#f97316', color: '#f97316' }}
                                loading={loading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUseDevMode();
                                }}
                            >
                                ใช้โหมดนี้
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Recent Folders Section */}
                {recentFolders.length > 0 && (
                    <Card>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <HistoryOutlined className="text-lg text-gray-500" />
                                <Text strong>โฟลเดอร์ที่ใช้ล่าสุด</Text>
                            </div>
                            <List
                                size="small"
                                dataSource={recentFolders.slice(0, 5)}
                                renderItem={(folder) => (
                                    <List.Item
                                        className="cursor-pointer hover:bg-gray-50 px-2 rounded"
                                        onClick={() => handleSelectRecentFolder(folder)}
                                        actions={[
                                            <Button 
                                                type="link" 
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectRecentFolder(folder);
                                                }}
                                            >
                                                เลือก
                                            </Button>
                                        ]}
                                    >
                                        <Text className="text-sm">{folder}</Text>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Card>
                )}

                {/* Selected Path Display */}
                {selectedPath && (
                    <Card className="bg-blue-50 border-blue-200">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <CheckCircleOutlined className="text-blue-500" />
                                <Text strong>โฟลเดอร์ที่เลือก:</Text>
                            </div>
                            <Input
                                value={selectedPath}
                                readOnly
                                className="bg-white"
                            />

                            {existingDataInfo?.hasData && (
                                <Alert
                                    message="พบข้อมูลเดิมในโฟลเดอร์นี้"
                                    description={`โฟลเดอร์นี้มีฐานข้อมูล AccTrack อยู่แล้ว แอปจะใช้ข้อมูลเดิมต่อไป`}
                                    type="success"
                                    showIcon
                                    icon={<CheckCircleOutlined />}
                                />
                            )}
                            
                            <Button 
                                type="primary" 
                                loading={loading}
                                onClick={handleUseSelected}
                                size="large"
                                block
                            >
                                {existingDataInfo?.hasData ? 'ใช้ข้อมูลจากโฟลเดอร์นี้' : 'ใช้โฟลเดอร์นี้'}
                            </Button>
                        </div>
                    </Card>
                )}
            </Space>

            <Alert
                message="หมายเหตุ"
                description="คุณสามารถเปลี่ยนตำแหน่งเก็บข้อมูลได้ในภายหลังผ่านเมนูตั้งค่า > การจัดเก็บข้อมูล"
                type="info"
                showIcon
            />
        </Modal>
    );
};

export default FirstTimeSetup;
