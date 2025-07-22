import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Flex, Spin, Alert } from 'antd';
import { ContactAddressData } from '../../../types/renderer';
import { useContactData } from '@/hooks/useContactData';

const ContactAddressForm: React.FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { contactData, loading, error, saveContactData } = useContactData();

    // Local form data state for editing
    const [formData, setFormData] = useState<ContactAddressData>({
        building: '',
        roomNumber: '',
        floor: '',
        village: '',
        houseNumber: '',
        moo: '',
        soi: '',
        road: '',
        subDistrict: '',
        district: '',
        province: '',
        country: 'ประเทศไทย',
        postalCode: '',
        phoneNumber: '',
    });

    // Update form data when contact data is loaded
    useEffect(() => {
        if (contactData) {
            setFormData(contactData);
        }
    }, [contactData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert 
                message="เกิดข้อผิดพลาด" 
                description={error} 
                type="error" 
                showIcon 
            />
        );
    }

    const currentData = contactData || formData;

    const handleSaveData = async () => {
        try {
            const result = await saveContactData(formData);
            if (result.success) {
                setIsEditing(false);
                console.log('บันทึกข้อมูลสำเร็จ');
            } else {
                console.error('Failed to save:', result.error);
            }
        } catch (err) {
            console.error('Error saving contact data:', err);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (contactData) {
            setFormData(contactData);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
        field: string,
    ) => {
        const value = typeof e === 'string' ? e : e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // Get full address display
    const getFullAddress = (data: ContactAddressData) => {
        const addressParts = [
            data.building && `อาคาร${data.building}`,
            data.roomNumber && `ห้อง ${data.roomNumber}`,
            data.floor && `ชั้น ${data.floor}`,
            data.village && `หมู่บ้าน${data.village}`,
            data.houseNumber && `เลขที่ ${data.houseNumber}`,
            data.moo && `หมู่ ${data.moo}`,
            data.soi && `ซ.${data.soi}`,
            data.road && `ถ.${data.road}`,
            data.subDistrict && `ต.${data.subDistrict}`,
            data.district && `อ.${data.district}`,
            data.province && `จ.${data.province}`,
            data.country,
            data.postalCode
        ].filter(Boolean);
        return addressParts.length > 0 ? addressParts.join(' ') : '-';
    };

    return (
        <div className="max-w-3xl w-[800px] p-4">
            <Flex justify="space-between" align="center" className="mb-4">
                <h1 className="text-2xl font-semibold mb-6">ข้อมูลติดต่อ</h1>
                {!isEditing ? (
                    <Button
                        type="primary"
                        size="large"
                        className="ml-4"
                        onClick={handleEdit}
                    >
                        แก้ไข
                    </Button>
                ) : (
                    <Flex gap="small">
                        <Button
                            size="large"
                            onClick={handleCancel}
                        >
                            ยกเลิก
                        </Button>
                    </Flex>
                )}
            </Flex>

            {!isEditing ? (
                // Display Mode
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                            <div className="p-2 bg-gray-50 rounded">{getFullAddress(currentData)}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                            <div className="p-2 bg-gray-50 rounded">{currentData.phoneNumber || '-'}</div>
                        </div>
                    </div>
                </div>
            ) : (
                // Edit Mode
                <Form layout="vertical" onFinish={handleSaveData}>
                    {/* Optional Fields */}
                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item label="อาคาร">
                            <Input
                                value={formData.building}
                                onChange={(e) => handleInputChange(e, 'building')}
                                placeholder="อาคาร"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item label="ห้องเลขที่">
                            <Input
                                value={formData.roomNumber}
                                onChange={(e) => handleInputChange(e, 'roomNumber')}
                                placeholder="ห้องเลขที่"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item label="ชั้นที่">
                            <Input
                                value={formData.floor}
                                onChange={(e) => handleInputChange(e, 'floor')}
                                placeholder="ชั้นที่"
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="หมู่บ้าน">
                            <Input
                                value={formData.village}
                                onChange={(e) => handleInputChange(e, 'village')}
                                placeholder="หมู่บ้าน"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item 
                            label="บ้านเลขที่ *" 
                            rules={[{ required: true, message: 'กรุณากรอกบ้านเลขที่' }]}
                        >
                            <Input
                                value={formData.houseNumber}
                                onChange={(e) => handleInputChange(e, 'houseNumber')}
                                placeholder="บ้านเลขที่"
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item label="หมู่ที่">
                            <Input
                                value={formData.moo}
                                onChange={(e) => handleInputChange(e, 'moo')}
                                placeholder="หมู่ที่"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item label="ซอย/ตรอก">
                            <Input
                                value={formData.soi}
                                onChange={(e) => handleInputChange(e, 'soi')}
                                placeholder="ซอย/ตรอก"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item label="ถนน">
                            <Input
                                value={formData.road}
                                onChange={(e) => handleInputChange(e, 'road')}
                                placeholder="ถนน"
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item 
                            label="แขวง/ตำบล *" 
                            rules={[{ required: true, message: 'กรุณากรอกแขวง/ตำบล' }]}
                        >
                            <Input
                                value={formData.subDistrict}
                                onChange={(e) => handleInputChange(e, 'subDistrict')}
                                placeholder="แขวง/ตำบล"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item 
                            label="เขต/อำเภอ *" 
                            rules={[{ required: true, message: 'กรุณากรอกเขต/อำเภอ' }]}
                        >
                            <Input
                                value={formData.district}
                                onChange={(e) => handleInputChange(e, 'district')}
                                placeholder="เขต/อำเภอ"
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item 
                            label="จังหวัด *" 
                            rules={[{ required: true, message: 'กรุณากรอกจังหวัด' }]}
                        >
                            <Input
                                value={formData.province}
                                onChange={(e) => handleInputChange(e, 'province')}
                                placeholder="จังหวัด"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item 
                            label="ประเทศ *" 
                            rules={[{ required: true, message: 'กรุณากรอกประเทศ' }]}
                        >
                            <Input
                                value={formData.country}
                                onChange={(e) => handleInputChange(e, 'country')}
                                placeholder="ประเทศ"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item 
                            label="รหัสไปรษณีย์ *" 
                            rules={[{ required: true, message: 'กรุณากรอกรหัสไปรษณีย์' }]}
                        >
                            <Input
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange(e, 'postalCode')}
                                placeholder="12345"
                                maxLength={5}
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item 
                        label="เบอร์โทรศัพท์ *" 
                        rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}
                    >
                        <Input
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange(e, 'phoneNumber')}
                            placeholder="081-234-5678"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Flex justify="flex-end">
                            <Button type="primary" htmlType="submit" size="large">
                                บันทึก
                            </Button>
                        </Flex>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default ContactAddressForm;
