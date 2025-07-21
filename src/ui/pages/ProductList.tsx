import React, { useState } from 'react';
import { Table, Button, Tag, Space, Card, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DefaultLayout from '@/layouts/default';

const { Option } = Select;

interface ProductData {
    key: string;
    productCode: string;
    productName: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out-of-stock';
}

const statusConfig = {
    active: { color: 'green', text: 'ใช้งาน' },
    inactive: { color: 'red', text: 'ไม่ใช้งาน' },
    'out-of-stock': { color: 'orange', text: 'สินค้าหมด' },
};

const categories = ['อุปกรณ์คอมพิวเตอร์', 'เครื่องใช้สำนักงาน', 'วัสดุก่อสร้าง', 'เครื่องเขียน'];

const mockData: ProductData[] = [
    {
        key: '1',
        productCode: 'PRD-001',
        productName: 'เมาส์คอมพิวเตอร์',
        category: 'อุปกรณ์คอมพิวเตอร์',
        price: 500,
        stock: 25,
        status: 'active',
    },
    {
        key: '2',
        productCode: 'PRD-002',
        productName: 'กระดาษ A4',
        category: 'เครื่องเขียน',
        price: 150,
        stock: 100,
        status: 'active',
    },
    {
        key: '3',
        productCode: 'PRD-003',
        productName: 'เก้าอี้สำนักงาน',
        category: 'เครื่องใช้สำนักงาน',
        price: 2500,
        stock: 0,
        status: 'out-of-stock',
    },
];

const ProductListPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [data] = useState<ProductData[]>(mockData);

    const filteredData = data.filter(item => {
        const matchSearch = searchText === '' || 
            item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.productCode.toLowerCase().includes(searchText.toLowerCase());
        const matchCategory = selectedCategory === '' || item.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    const columns: ColumnsType<ProductData> = [
        {
            title: 'รหัสสินค้า',
            dataIndex: 'productCode',
            key: 'productCode',
            sorter: (a, b) => a.productCode.localeCompare(b.productCode),
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'productName',
            key: 'productName',
            sorter: (a, b) => a.productName.localeCompare(b.productName),
        },
        {
            title: 'หมวดหมู่',
            dataIndex: 'category',
            key: 'category',
            filters: categories.map(cat => ({ text: cat, value: cat })),
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'ราคา',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `฿${price.toLocaleString()}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'คลังสินค้า',
            dataIndex: 'stock',
            key: 'stock',
            sorter: (a, b) => a.stock - b.stock,
            render: (stock: number) => (
                <span style={{ color: stock === 0 ? 'red' : stock < 10 ? 'orange' : 'inherit' }}>
                    {stock} ชิ้น
                </span>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: (status: keyof typeof statusConfig) => (
                <Tag color={statusConfig[status].color}>
                    {statusConfig[status].text}
                </Tag>
            ),
            filters: [
                { text: 'ใช้งาน', value: 'active' },
                { text: 'ไม่ใช้งาน', value: 'inactive' },
                { text: 'สินค้าหมด', value: 'out-of-stock' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'การดำเนินการ',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" size="small">
                        ดู
                    </Button>
                    <Button type="link" size="small">
                        แก้ไข
                    </Button>
                    <Button type="link" size="small" danger={record.status === 'active'}>
                        {record.status === 'active' ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'}
                    </Button>
                </Space>
            ),
        },
    ];

    const handleNewProduct = () => {
        console.log('Navigate to new product form');
    };

    return (
        <DefaultLayout>
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">รายการสินค้า</h1>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleNewProduct}
                            size="large"
                        >
                            เพิ่มสินค้าใหม่
                        </Button>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="ค้นหาชื่อสินค้า หรือ รหัสสินค้า..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <Select
                            placeholder="เลือกหมวดหมู่"
                            value={selectedCategory || undefined}
                            onChange={setSelectedCategory}
                            style={{ width: 200 }}
                            allowClear
                        >
                            {categories.map(category => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
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
            </div>
        </DefaultLayout>
    );
};

export default ProductListPage;
