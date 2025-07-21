import React, { useState } from 'react';
import { Table, Button, Space, Card, Input, Modal, Form } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DefaultLayout from '@/layouts/default';

interface CategoryData {
    key: string;
    categoryId: string;
    categoryName: string;
    description: string;
    productCount: number;
}

const mockData: CategoryData[] = [
    {
        key: '1',
        categoryId: 'CAT-001',
        categoryName: 'อุปกรณ์คอมพิวเตอร์',
        description: 'อุปกรณ์และชิ้นส่วนคอมพิวเตอร์ทุกประเภท',
        productCount: 25,
    },
    {
        key: '2',
        categoryId: 'CAT-002',
        categoryName: 'เครื่องใช้สำนักงาน',
        description: 'เฟอร์นิเจอร์และอุปกรณ์สำนักงาน',
        productCount: 15,
    },
    {
        key: '3',
        categoryId: 'CAT-003',
        categoryName: 'วัสดุก่อสร้าง',
        description: 'วัสดุสำหรับงานก่อสร้างและปรับปรุง',
        productCount: 30,
    },
    {
        key: '4',
        categoryId: 'CAT-004',
        categoryName: 'เครื่องเขียน',
        description: 'อุปกรณ์เครื่องเขียนและอุปกรณ์การเรียน',
        productCount: 50,
    },
];

const ProductCategoriesPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState<CategoryData[]>(mockData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
    const [form] = Form.useForm();

    const filteredData = data.filter(item =>
        item.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: ColumnsType<CategoryData> = [
        {
            title: 'รหัสหมวดหมู่',
            dataIndex: 'categoryId',
            key: 'categoryId',
            sorter: (a, b) => a.categoryId.localeCompare(b.categoryId),
        },
        {
            title: 'ชื่อหมวดหมู่',
            dataIndex: 'categoryName',
            key: 'categoryName',
            sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
        },
        {
            title: 'คำอธิบาย',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'จำนวนสินค้า',
            dataIndex: 'productCount',
            key: 'productCount',
            render: (count: number) => `${count} รายการ`,
            sorter: (a, b) => a.productCount - b.productCount,
        },
        {
            title: 'การดำเนินการ',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        แก้ไข
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                        disabled={record.productCount > 0}
                    >
                        ลบ
                    </Button>
                </Space>
            ),
        },
    ];

    const handleNewCategory = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (category: CategoryData) => {
        setEditingCategory(category);
        form.setFieldsValue(category);
        setIsModalVisible(true);
    };

    const handleDelete = (category: CategoryData) => {
        Modal.confirm({
            title: 'ยืนยันการลบ',
            content: `คุณต้องการลบหมวดหมู่ "${category.categoryName}" หรือไม่?`,
            onOk() {
                setData(prev => prev.filter(item => item.key !== category.key));
            },
        });
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            if (editingCategory) {
                // Edit existing category
                setData(prev => prev.map(item => 
                    item.key === editingCategory.key 
                        ? { ...item, ...values }
                        : item
                ));
            } else {
                // Add new category
                const newCategory: CategoryData = {
                    key: Date.now().toString(),
                    categoryId: `CAT-${String(data.length + 1).padStart(3, '0')}`,
                    productCount: 0,
                    ...values,
                };
                setData(prev => [...prev, newCategory]);
            }
            setIsModalVisible(false);
            form.resetFields();
            setEditingCategory(null);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingCategory(null);
    };

    return (
        <DefaultLayout>
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">หมวดหมู่สินค้า</h1>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleNewCategory}
                            size="large"
                        >
                            เพิ่มหมวดหมู่ใหม่
                        </Button>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="ค้นหาหมวดหมู่..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{
                            total: filteredData.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} จาก ${total} รายการ`,
                        }}
                        scroll={{ x: 800 }}
                    />
                </Card>

                <Modal
                    title={editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText={editingCategory ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
                    cancelText="ยกเลิก"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="categoryForm"
                    >
                        <Form.Item
                            name="categoryName"
                            label="ชื่อหมวดหมู่"
                            rules={[{ required: true, message: 'กรุณากรอกชื่อหมวดหมู่' }]}
                        >
                            <Input placeholder="ชื่อหมวดหมู่" />
                        </Form.Item>
                        
                        <Form.Item
                            name="description"
                            label="คำอธิบาย"
                            rules={[{ required: true, message: 'กรุณากรอกคำอธิบาย' }]}
                        >
                            <Input.TextArea rows={3} placeholder="คำอธิบายหมวดหมู่" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </DefaultLayout>
    );
};

export default ProductCategoriesPage;
