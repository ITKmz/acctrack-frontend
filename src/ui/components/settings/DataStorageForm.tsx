import React, { useState, useEffect } from 'react';
import { Form, Radio, Button, Card, Alert, Space, Typography, Divider, Switch, Input } from 'antd';
import { DatabaseOutlined, CloudOutlined, FolderOpenOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface DataStorageSettings {
    storageType: 'sqlite' | 'cloud';
    autoBackup: boolean;
    backupInterval: number; // in hours
    databasePath?: string;
}

const DataStorageForm: React.FC = () => {
    const [form] = Form.useForm();
    const [settings, setSettings] = useState<DataStorageSettings>({
        storageType: 'sqlite',
        autoBackup: true,
        backupInterval: 24,
    });
    const [loading, setLoading] = useState(false);

    // Load current settings when component mounts
    useEffect(() => {
        loadStorageSettings();
    }, []);

    const loadStorageSettings = async () => {
        try {
            if (window?.electron?.getStorageSettings) {
                const savedSettings = await window.electron.getStorageSettings();
                if (savedSettings) {
                    setSettings(savedSettings);
                    form.setFieldsValue(savedSettings);
                }
            } else {
                // Fallback for web - load from localStorage
                const saved = localStorage.getItem('storageSettings');
                if (saved) {
                    const parsedSettings = JSON.parse(saved);
                    setSettings(parsedSettings);
                    form.setFieldsValue(parsedSettings);
                }
            }
        } catch (error) {
            console.error('Error loading storage settings:', error);
        }
    };

    const saveStorageSettings = async (values: DataStorageSettings) => {
        setLoading(true);
        try {
            if (window?.electron?.saveStorageSettings) {
                // Save through Electron
                await window.electron.saveStorageSettings(values);
            } else {
                // Fallback for web
                localStorage.setItem('storageSettings', JSON.stringify(values));
            }
            
            setSettings(values);
            
            // Show success message
            if (window?.electron?.showMessageBox) {
                await window.electron.showMessageBox({
                    type: 'info',
                    title: 'การตั้งค่า',
                    message: 'บันทึกการตั้งค่าเรียบร้อยแล้ว',
                    detail: 'การเปลี่ยนแปลงบางอย่างอาจต้องเริ่มแอปพลิเคชันใหม่'
                });
            } else {
                alert('บันทึกการตั้งค่าเรียบร้อยแล้ว');
            }
        } catch (error) {
            console.error('Error saving storage settings:', error);
            if (window?.electron?.showMessageBox) {
                await window.electron.showMessageBox({
                    type: 'error',
                    title: 'ข้อผิดพลาด',
                    message: 'ไม่สามารถบันทึกการตั้งค่าได้',
                    detail: error instanceof Error ? error.message : 'Unknown error'
                });
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBrowseFolder = async () => {
        if (window?.electron?.showOpenDialog) {
            const result = await window.electron.showOpenDialog({
                properties: ['openDirectory'],
                title: 'เลือกโฟลเดอร์สำหรับเก็บไฟล์ฐานข้อมูล'
            });

            if (!result.canceled && result.filePaths.length > 0) {
                const selectedPath = result.filePaths[0];
                form.setFieldValue('databasePath', selectedPath);
            }
        } else {
            alert('การเลือกโฟลเดอร์สามารถใช้ได้เฉพาะในโหมด Electron เท่านั้น');
        }
    };

    const getStorageDescription = (type: string) => {
        switch (type) {
            case 'sqlite':
                return {
                    title: 'SQLite Database (แนะนำ)',
                    description: 'เก็บข้อมูลในฐานข้อมูล SQLite ในเครื่อง ให้ประสิทธิภาพสูงและความเสถียร คุณสามารถเลือกตำแหน่งที่ต้องการเก็บไฟล์ฐานข้อมูลได้',
                    icon: <DatabaseOutlined />
                };
            case 'cloud':
                return {
                    title: 'Cloud Storage (กำลังพัฒนา)',
                    description: 'เก็บข้อมูลบนคลาวด์ เข้าถึงได้จากทุกที่',
                    icon: <CloudOutlined />
                };
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl p-6">
            <Title level={2}>การจัดเก็บข้อมูล</Title>
            <Paragraph>
                เลือกวิธีการจัดเก็บข้อมูลที่เหมาะสมกับการใช้งานของคุณ
            </Paragraph>

            <Form
                form={form}
                layout="vertical"
                initialValues={settings}
                onFinish={saveStorageSettings}
                className="mt-6"
            >
                <Form.Item name="storageType" label="ประเภทการจัดเก็บข้อมูล">
                    <Radio.Group className="w-full">
                        <Space direction="vertical" className="w-full" size="large">
                            {['sqlite', 'cloud'].map((type) => {
                                const info = getStorageDescription(type);
                                if (!info) return null;

                                return (
                                    <Card
                                        key={type}
                                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                            settings.storageType === type ? 'border-blue-500 shadow-md' : ''
                                        }`}
                                        onClick={() => {
                                            form.setFieldValue('storageType', type);
                                            setSettings(prev => ({ ...prev, storageType: type as any }));
                                        }}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <Radio value={type} className="mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    {info.icon}
                                                    <Text strong>{info.title}</Text>
                                                </div>
                                                <Paragraph className="text-gray-600 mb-3">
                                                    {info.description}
                                                </Paragraph>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </Space>
                    </Radio.Group>
                </Form.Item>

                {/* Database Path Input for SQLite */}
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.storageType !== currentValues.storageType
                    }
                >
                    {({ getFieldValue }) => {
                        const storageType = getFieldValue('storageType');
                        return storageType === 'sqlite' ? (
                            <Form.Item
                                name="databasePath"
                                label="ตำแหน่งไฟล์ฐานข้อมูล"
                                extra="หากไม่ระบุ จะใช้ตำแหน่งเริ่มต้นในโฟลเดอร์ของแอปพลิเคชัน"
                            >
                                <Input.Group compact>
                                    <Input
                                        style={{ width: 'calc(100% - 120px)' }}
                                        placeholder="ใช้ตำแหน่งเริ่มต้น..."
                                        readOnly
                                    />
                                    <Button onClick={handleBrowseFolder}>
                                        <FolderOpenOutlined /> เลือก
                                    </Button>
                                </Input.Group>
                            </Form.Item>
                        ) : null;
                    }}
                </Form.Item>

                <Divider />

                <Title level={4}>ตั้งค่าเพิ่มเติม</Title>

                <Form.Item name="autoBackup" valuePropName="checked">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <Text strong>สำรองข้อมูลอัตโนมัติ</Text>
                            <br />
                            <Text type="secondary">สำรองข้อมูลเป็นระยะเวลาที่กำหนด</Text>
                        </div>
                        <Switch />
                    </div>
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.autoBackup !== currentValues.autoBackup
                    }
                >
                    {({ getFieldValue }) =>
                        getFieldValue('autoBackup') ? (
                            <Form.Item
                                name="backupInterval"
                                label="ช่วงเวลาการสำรองข้อมูล (ชั่วโมง)"
                                rules={[
                                    { required: true, message: 'กรุณากรอกช่วงเวลา' },
                                    { type: 'number', min: 1, max: 168, message: 'ช่วงเวลาต้องอยู่ระหว่าง 1-168 ชั่วโมง' }
                                ]}
                            >
                                <Input type="number" min={1} max={168} addonAfter="ชั่วโมง" />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>

                <Alert
                    message="หมายเหตุ"
                    description="การเปลี่ยนแปลงประเภทการจัดเก็บข้อมูลอาจต้องเริ่มแอปพลิเคชันใหม่ และควรสำรองข้อมูลก่อนเปลี่ยนแปลง"
                    type="info"
                    showIcon
                    className="mb-6"
                />

                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                        >
                            บันทึกการตั้งค่า
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setSettings({
                                    storageType: 'sqlite',
                                    autoBackup: true,
                                    backupInterval: 24,
                                });
                            }}
                            size="large"
                        >
                            รีเซ็ต
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default DataStorageForm;
