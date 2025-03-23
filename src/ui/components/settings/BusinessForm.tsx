import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Select, DatePicker, Radio } from 'antd';
import dayjs from 'dayjs';

interface BusinessData {
    businessType: string;
    registrationNumber: string;
    officeType: string;
    individualDetails: {
        type: string;
    };
    juristicDetails: {
        type: string;
    };
    businessName: string;
    businessDescription: string;
    registrationDate: string;
    vatRegistered: boolean;
    vatDetails: {
        vatRegistrationDate?: string; // Changed to date
    };
}

const BusinessForm: React.FC = () => {
    const [businessData, setBusinessData] = useState<BusinessData>({
        businessType: 'บุคคลธรรมดา',
        registrationNumber: '',
        officeType: 'สำนักงานใหญ่',
        individualDetails: { type: '' },
        juristicDetails: { type: '' },
        businessName: '',
        businessDescription: '',
        registrationDate: '',
        vatRegistered: false,
        vatDetails: {},
    });

    const [userId, setUserId] = useState<string>('user123'); // Example user ID

    // Load existing data when the component mounts
    useEffect(() => {
        const loadData = async () => {
            const data = await window.electron.readFile(userId);
            setBusinessData(data);
        };

        loadData();
    }, [userId]);

    const handleSaveData = async () => {
        await window.electron.saveFile(userId, businessData); // Save data by user ID
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
    ) => {
        setBusinessData((prevData) => ({
            ...prevData,
            [field]: e.target.value,
        }));
    };

    const handleSelectChange = (value: string | boolean, field: string) => {
        setBusinessData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleDateChange = (date: any, field: string) => {
        setBusinessData((prevData) => ({
            ...prevData,
            [field]: date ? dayjs(date).format('YYYY-MM-DD') : '', // Format as YYYY-MM-DD
        }));
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">
                Business Registration Form
            </h1>

            <Form layout="vertical" onFinish={handleSaveData}>
                {/* Business Type */}
                <Form.Item label="รูปแบบธุรกิจ">
                    <Radio.Group
                        value={businessData.businessType}
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
                    <Input
                        type="text"
                        value={businessData.registrationNumber}
                        onChange={(e) =>
                            handleInputChange(e, 'registrationNumber')
                        }
                        className="w-full"
                    />
                </Form.Item>

                {/* Office Type */}
                <Form.Item>
                    <Radio.Group
                        value={businessData.officeType}
                        onChange={(e) =>
                            handleSelectChange(e.target.value, 'officeType')
                        }
                        className="w-full"
                    >
                        <Radio value="สำนักงานใหญ่">สำนักงานใหญ่</Radio>
                        <Radio value="สาขา">สาขา</Radio>
                        {/* Show "ไม่ระบุ" only if businessType is not "นิติบุคคล" */}
                        {businessData.businessType !== 'นิติบุคคล' && (
                            <Radio value="ไม่ระบุ">ไม่ระบุ</Radio>
                        )}
                    </Radio.Group>
                </Form.Item>

                {/* Individual or Juristic Type */}
                {businessData.businessType === 'บุคคลธรรมดา' && (
                    <Form.Item label="บุคคลธรรมดา">
                        <Select
                            value={businessData.individualDetails.type}
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

                {businessData.businessType === 'นิติบุคคล' && (
                    <Form.Item label="นิติบุคคล">
                        <Select
                            value={businessData.juristicDetails.type}
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
                            message: 'กรุณากรอกชื่อกิจการ', // "Please enter the business name"
                        },
                    ]}
                >
                    <Input
                        type="text"
                        value={businessData.businessName}
                        onChange={(e) => handleInputChange(e, 'businessName')}
                        className="w-full"
                    />
                </Form.Item>

                {/* Business Description */}
                <Form.Item label="รายละเอียดกิจการ">
                    <Input
                        type="text"
                        value={businessData.businessDescription}
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
                            businessData.registrationDate
                                ? dayjs(businessData.registrationDate)
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
                        value={businessData.vatRegistered}
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
                {businessData.vatRegistered && (
                    <Form.Item label="วันที่จดทะเบียนภาษีมูลค่าเพิ่ม">
                        <DatePicker
                            value={
                                businessData.vatDetails.vatRegistrationDate
                                    ? dayjs(
                                          businessData.vatDetails
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
                    <Button type="primary" htmlType="submit" className="w-full">
                        Save Business Data
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BusinessForm;
