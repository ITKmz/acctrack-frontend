import React from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Card, Row, Col } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import DefaultLayout from '@/layouts/default';

const { TextArea } = Input;
const { Option } = Select;

interface QuotationFormProps {
    onBack?: () => void;
    onSave?: (values: any) => void;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ onBack, onSave }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        console.log('Form values:', values);
        if (onSave) {
            onSave(values);
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <DefaultLayout>
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBack}
                        >
                            กลับ
                        </Button>
                        <h1 className="text-2xl font-bold">สร้างใบเสนอราคาใหม่</h1>
                    </div>
                </div>

                <Card>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            status: 'pending',
                        }}
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="quotationNumber"
                                    label="เลขที่ใบเสนอราคา"
                                    rules={[{ required: true, message: 'กรุณากรอกเลขที่ใบเสนอราคา' }]}
                                >
                                    <Input placeholder="QT-2024-XXX" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="date"
                                    label="วันที่"
                                    rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="customerName"
                                    label="ชื่อลูกค้า"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อลูกค้า' }]}
                                >
                                    <Input placeholder="ชื่อลูกค้า" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="customerContact"
                                    label="ข้อมูลติดต่อ"
                                >
                                    <Input placeholder="เบอร์โทร/อีเมล" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="customerAddress"
                            label="ที่อยู่ลูกค้า"
                        >
                            <TextArea rows={3} placeholder="ที่อยู่ลูกค้า" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="amount"
                                    label="จำนวนเงิน"
                                    rules={[{ required: true, message: 'กรุณากรอกจำนวนเงิน' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="0.00"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="status"
                                    label="สถานะ"
                                >
                                    <Select>
                                        <Option value="pending">รออนุมัติ</Option>
                                        <Option value="approved">อนุมัติแล้ว</Option>
                                        <Option value="expired">พ้นกำหนด</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="description"
                            label="รายละเอียด"
                        >
                            <TextArea rows={4} placeholder="รายละเอียดใบเสนอราคา" />
                        </Form.Item>

                        <Form.Item
                            name="notes"
                            label="หมายเหตุ"
                        >
                            <TextArea rows={2} placeholder="หมายเหตุเพิ่มเติม" />
                        </Form.Item>

                        <div className="flex justify-end gap-4">
                            <Button onClick={handleBack}>
                                ยกเลิก
                            </Button>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                บันทึกใบเสนอราคา
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </DefaultLayout>
    );
};

export default QuotationForm;
