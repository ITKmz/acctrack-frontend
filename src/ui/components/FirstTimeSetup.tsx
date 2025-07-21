import React, { useState } from 'react';
import { Modal, Button, Typography, Space, Input, Alert, Card, message } from 'antd';
import { FolderOpenOutlined, DatabaseOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface FirstTimeSetupProps {
    visible: boolean;
    onComplete: (selectedPath?: string) => void;
}

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ visible, onComplete }) => {
    const [selectedPath, setSelectedPath] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [existingDataInfo, setExistingDataInfo] = useState<{ hasData: boolean; tableCount?: number } | null>(null);

    const handleBrowseFolder = async () => {
        if (window?.electron?.showOpenDialog) {
            const result = await window.electron.showOpenDialog({
                properties: ['openDirectory'],
                title: 'เลือกโฟลเดอร์สำหรับเก็บข้อมูลแอปพลิเคชัน'
            });

            if (!result.canceled && result.filePaths.length > 0) {
                const path = result.filePaths[0];
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
            }
        } else {
            alert('การเลือกโฟลเดอร์สามารถใช้ได้เฉพาะในโหมด Electron เท่านั้น');
        }
    };

    const handleUseDefault = async () => {
        setLoading(true);
        try {
            // Save default storage settings
            const defaultSettings = {
                storageType: 'sqlite' as const,
                autoBackup: true,
                backupInterval: 24,
            };

            if (window?.electron?.saveStorageSettings) {
                await window.electron.saveStorageSettings(defaultSettings);
            }

            onComplete(); // No custom path, use default
        } catch (error) {
            console.error('Error setting up default storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUseCustom = async () => {
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

            onComplete(selectedPath); // Use custom path
        } catch (error) {
            console.error('Error setting up custom storage:', error);
            alert('เกิดข้อผิดพลาดในการตั้งค่าตำแหน่งเก็บข้อมูล');
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
            width={600}
            centered
        >
            <div className="text-center mb-6">
                <DatabaseOutlined className="text-6xl text-blue-500 mb-4" />
                <Title level={2}>ยินดีต้อนรับสู่ AccTrack</Title>
                <Paragraph className="text-gray-600">
                    กรุณาเลือกตำแหน่งที่ต้องการเก็บข้อมูลของคุณ
                </Paragraph>
            </div>

            <Space direction="vertical" className="w-full" size="large">
                {/* Default Option */}
                <Card 
                    className="cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={handleUseDefault}
                >
                    <div className="flex items-center space-x-4">
                        <DatabaseOutlined className="text-2xl text-blue-500" />
                        <div className="flex-1">
                            <Text strong className="text-lg">ใช้ตำแหน่งเริ่มต้น (แนะนำ)</Text>
                            <br />
                            <Text type="secondary">
                                เก็บข้อมูลในโฟลเดอร์ของแอปพลิเคชัน ง่ายและปลอดภัย
                            </Text>
                        </div>
                        <Button 
                            type="primary" 
                            loading={loading}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleUseDefault();
                            }}
                        >
                            ใช้ตำแหน่งนี้
                        </Button>
                    </div>
                </Card>

                {/* Custom Option */}
                <Card className="hover:shadow-md transition-all duration-200">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <FolderOpenOutlined className="text-2xl text-orange-500" />
                            <div className="flex-1">
                                <Text strong className="text-lg">เลือกตำแหน่งเอง</Text>
                                <br />
                                <Text type="secondary">
                                    เลือกโฟลเดอร์ที่ต้องการเก็บข้อมูล เหมาะสำหรับการสำรองหรือแชร์ข้อมูล
                                </Text>
                            </div>
                        </div>

                        <div className="pl-12">
                            <Input.Group compact>
                                <Input
                                    style={{ width: 'calc(100% - 120px)' }}
                                    placeholder="เลือกโฟลเดอร์..."
                                    value={selectedPath}
                                    readOnly
                                />
                                <Button onClick={handleBrowseFolder}>
                                    <FolderOpenOutlined /> เลือก
                                </Button>
                            </Input.Group>

                            {selectedPath && (
                                <div className="mt-3 space-y-3">
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
                                        onClick={handleUseCustom}
                                        block
                                    >
                                        {existingDataInfo?.hasData ? 'ใช้ข้อมูลจากโฟลเดอร์นี้' : 'ใช้โฟลเดอร์นี้'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </Space>

            <Alert
                message="หมายเหตุ"
                description="คุณสามารถเปลี่ยนตำแหน่งเก็บข้อมูลได้ในภายหลังผ่านเมนูตั้งค่า > การจัดเก็บข้อมูล"
                type="info"
                showIcon
                className="mt-6"
            />
        </Modal>
    );
};

export default FirstTimeSetup;
