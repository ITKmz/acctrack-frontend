import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Select, DatePicker, Radio, Flex, Spin, Alert } from 'antd';
import dayjs from 'dayjs';
import { useBusinessData, type BusinessData } from '@/hooks/useDatabase';

const BusinessForm: React.FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { businessData, loading, error, saveBusinessData } = useBusinessData();

    // Local form data state for editing
    const [formData, setFormData] = useState<BusinessData>({
        businessType: 'บุคคลธรรมดา',
        registrationNumber: '',
        officeType: 'สำนักงานใหญ่',
        branch: '',
        individualDetails: { type: '' },
        juristicDetails: { type: '' },
        businessName: '',
        businessDescription: '',
        registrationDate: '',
        vatRegistered: false,
        vatDetails: {},
    });

    // Update form data when business data is loaded
    useEffect(() => {
        if (businessData) {
            setFormData(businessData);
        }
    }, [businessData]);

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

    const currentData = businessData || formData;

    const handleSaveData = async () => {
        try {
            const result = await saveBusinessData(formData);
            if (result.success) {
                setIsEditing(false);
                // Success message is handled by the hook
            } else {
                console.error('Failed to save:', result.error);
            }
        } catch (err) {
            console.error('Error saving business data:', err);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to original business data
        if (businessData) {
            setFormData(businessData);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement> | string,
        field: string,
    ) => {
        const value = typeof e === 'string' ? e : e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSelectChange = (value: string | boolean, field: string) => {
        setFormData((prevData) => {
            if (field === 'individualDetails') {
                return {
                    ...prevData,
                    individualDetails: {
                        ...prevData.individualDetails,
                        type: value as string,
                    },
                };
            } else if (field === 'juristicDetails') {
                return {
                    ...prevData,
                    juristicDetails: {
                        ...prevData.juristicDetails,
                        type: value as string,
                    },
                };
            } else {
                return {
                    ...prevData,
                    [field]: value,
                };
            }
        });
    };

    const handleDateChange = (date: any, field: string) => {
        setFormData((prevData) => {
            if (field.startsWith('vatDetails.')) {
                const key = field.split('.')[1];
                return {
                    ...prevData,
                    vatDetails: {
                        ...prevData.vatDetails,
                        [key]: date ? dayjs(date).format('YYYY-MM-DD') : '',
                    },
                };
            }
            return {
                ...prevData,
                [field]: date ? dayjs(date).format('YYYY-MM-DD') : '',
            };
        });
    };

    // Helper function to render display text for business type details
    const getBusinessTypeDisplayText = () => {
        if (currentData.businessType === 'บุคคลธรรมดา') {
            return currentData.individualDetails.type || '-';
        } else {
            return currentData.juristicDetails.type || '-';
        }
    };

    return (
        <div className="max-w-3xl w-[800px] p-4">
            <Flex justify="space-between" align="center" className="mb-4">
                <h1 className="text-2xl font-semibold mb-6">ข้อมูลกิจการ</h1>
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
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รูปแบบธุรกิจ</label>
                        <div className="p-2 bg-gray-50 rounded">{currentData.businessType}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เลขทะเบียน 13 หลัก</label>
                        <div className="p-2 bg-gray-50 rounded">{currentData.registrationNumber || '-'}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทสำนักงาน</label>
                        <div className="p-2 bg-gray-50 rounded">
                            {currentData.officeType}
                            {currentData.officeType === 'สาขา' && currentData.branch && ` (${currentData.branch})`}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทธุรกิจ</label>
                        <div className="p-2 bg-gray-50 rounded">{getBusinessTypeDisplayText()}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อกิจการ</label>
                        <div className="p-2 bg-gray-50 rounded">{currentData.businessName || '-'}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดกิจการ</label>
                        <div className="p-2 bg-gray-50 rounded">{currentData.businessDescription || '-'}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">วันที่จดทะเบียนกิจการ</label>
                        <div className="p-2 bg-gray-50 rounded">
                            {currentData.registrationDate ? dayjs(currentData.registrationDate).format('DD/MM/YYYY') : '-'}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">จดทะเบียนภาษีมูลค่าเพิ่ม</label>
                        <div className="p-2 bg-gray-50 rounded">
                            {currentData.vatRegistered ? 'จดทะเบียน' : 'ไม่จดทะเบียน'}
                        </div>
                    </div>

                    {currentData.vatRegistered && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่จดทะเบียนภาษีมูลค่าเพิ่ม</label>
                            <div className="p-2 bg-gray-50 rounded">
                                {currentData.vatDetails.vatRegistrationDate 
                                    ? dayjs(currentData.vatDetails.vatRegistrationDate).format('DD/MM/YYYY') 
                                    : '-'}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Edit Mode
                <Form layout="vertical" onFinish={handleSaveData}>
                    {/* Business Type */}
                    <Form.Item label="รูปแบบธุรกิจ">
                        <Radio.Group
                            value={formData.businessType}
                            onChange={(e) =>
                                handleSelectChange(e.target.value, 'businessType')
                            }
                            className="w-full"
                        >
                            <Radio value="บุคคลธรรมดา">บุคคลธรรมดา</Radio>
                            <Radio value="นิติบุคคล">นิติบุคคล</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* Registration Number */}
                    <Form.Item label="เลขทะเบียน 13 หลัก">
                        <Input.OTP
                            length={13}
                            type="text"
                            value={formData.registrationNumber}
                            onChange={(e) =>
                                handleInputChange(e, 'registrationNumber')
                            }
                            className="w-full"
                        />
                    </Form.Item>

                    {/* Office Type */}
                    <Form.Item>
                        <Radio.Group
                            value={formData.officeType}
                            onChange={(e) =>
                                handleSelectChange(e.target.value, 'officeType')
                            }
                            className="w-full"
                        >
                            {/* Show "ไม่ระบุ" only if businessType is not "นิติบุคคล" */}
                            {formData.businessType !== 'นิติบุคคล' && (
                                <Radio value="ไม่ระบุ">ไม่ระบุ</Radio>
                            )}
                            <Radio value="สำนักงานใหญ่">สำนักงานใหญ่</Radio>
                            <Radio value="สาขา">สาขา</Radio>
                        </Radio.Group>
                        {formData.officeType === 'สาขา' && (
                            <Input
                                type="text"
                                value={
                                    formData.branch ? formData.branch : ''
                                }
                                onChange={(e) => handleInputChange(e, 'branch')}
                            />
                        )}
                    </Form.Item>

                    {/* Individual or Juristic Type */}
                    {formData.businessType === 'บุคคลธรรมดา' && (
                        <Form.Item label="บุคคลธรรมดา">
                            <Select
                                value={formData.individualDetails.type}
                                onChange={(value) =>
                                    handleSelectChange(value, 'individualDetails')
                                }
                                className="w-full"
                            >
                                <Select.Option value="บุคคลธรรมดา">
                                    บุคคลธรรมดา
                                </Select.Option>
                                <Select.Option value="ห้างหุ้นส่วนสามัญ">
                                    ห้างหุ้นส่วนสามัญ
                                </Select.Option>
                                <Select.Option value="ร้านค้า">
                                    ร้านค้า
                                </Select.Option>
                                <Select.Option value="คณะบุคคล">
                                    คณะบุคคล
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    )}

                    {formData.businessType === 'นิติบุคคล' && (
                        <Form.Item label="นิติบุคคล">
                            <Select
                                value={formData.juristicDetails.type}
                                onChange={(value) =>
                                    handleSelectChange(value, 'juristicDetails')
                                }
                                className="w-full"
                            >
                                <Select.Option value="บริษัทจำกัด">
                                    บริษัทจำกัด
                                </Select.Option>
                                <Select.Option value="บริษัทมหาชนจำกัด">
                                    บริษัทมหาชนจำกัด
                                </Select.Option>
                                <Select.Option value="ห้างหุ้นส่วนจำกัด">
                                    ห้างหุ้นส่วนจำกัด
                                </Select.Option>
                                <Select.Option value="มูลนิธิ">
                                    มูลนิธิ
                                </Select.Option>
                                <Select.Option value="สมาคม">สมาคม</Select.Option>
                                <Select.Option value="กิจการร่วมค้า">
                                    กิจการร่วมค้า
                                </Select.Option>
                                <Select.Option value="อื่น ๆ">อื่น ๆ</Select.Option>
                            </Select>
                        </Form.Item>
                    )}

                    {/* Business Name */}
                    <Form.Item
                        label="ชื่อกิจการ"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณากรอกชื่อกิจการ',
                            },
                        ]}
                    >
                        <Input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange(e, 'businessName')}
                            className="w-full"
                        />
                    </Form.Item>

                    {/* Business Description */}
                    <Form.Item label="รายละเอียดกิจการ">
                        <Input
                            type="text"
                            value={formData.businessDescription}
                            onChange={(e) =>
                                handleInputChange(e, 'businessDescription')
                            }
                            className="w-full"
                        />
                    </Form.Item>

                    {/* Registration Date */}
                    <Form.Item label="วันที่จดทะเบียนกิจการ">
                        <DatePicker
                            value={
                                formData.registrationDate
                                    ? dayjs(formData.registrationDate)
                                    : null
                            }
                            onChange={(date) =>
                                handleDateChange(date, 'registrationDate')
                            }
                            className="w-full"
                        />
                    </Form.Item>

                    {/* VAT Registered */}
                    <Form.Item label="จดทะเบียนภาษีมูลค่าเพิ่ม">
                        <Radio.Group
                            value={formData.vatRegistered}
                            onChange={(e) =>
                                handleSelectChange(e.target.value, 'vatRegistered')
                            }
                            className="w-full"
                        >
                            <Radio value={true}>จดทะเบียน</Radio>
                            <Radio value={false}>ไม่จดทะเบียน</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* VAT Registration Date */}
                    {formData.vatRegistered && (
                        <Form.Item label="วันที่จดทะเบียนภาษีมูลค่าเพิ่ม">
                            <DatePicker
                                value={
                                    formData.vatDetails.vatRegistrationDate
                                        ? dayjs(
                                              formData.vatDetails
                                                  .vatRegistrationDate,
                                          )
                                        : null
                                }
                                onChange={(date) =>
                                    handleDateChange(
                                        date,
                                        'vatDetails.vatRegistrationDate',
                                    )
                                }
                                className="w-full"
                            />
                        </Form.Item>
                    )}

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

export default BusinessForm;
