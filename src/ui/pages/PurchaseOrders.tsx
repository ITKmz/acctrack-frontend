import React, { useState } from 'react';
import { Table, Button, Tag, Space, Card, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DefaultLayout from '@/layouts/default';

interface PurchaseOrderData {
    key: string;
    poNumber: string;
    supplierName: string;
    amount: number;
    orderDate: string;
    deliveryDate: string;
    status: 'pending' | 'received' | 'cancelled';
}

const statusConfig = {
    pending: { color: 'orange', text: 'รออนุมัติ' },
    received: { color: 'green', text: 'รับสินค้าแล้ว' },
    cancelled: { color: 'red', text: 'ยกเลิก' },
};

const mockData: PurchaseOrderData[] = [
    {
        key: '1',
        poNumber: 'PO-2024-001',
        supplierName: 'บริษัท วัสดุก่อสร้าง จำกัด',
        amount: 25000,
        orderDate: '2024-01-15',
        deliveryDate: '2024-01-25',
        status: 'pending',
    },
    {
        key: '2',
        poNumber: 'PO-2024-002',
        supplierName: 'ห้างหุ้นส่วน เครื่องใช้สำนักงาน',
        amount: 15000,
        orderDate: '2024-01-10',
        deliveryDate: '2024-01-20',
        status: 'received',
    },
    {
        key: '3',
        poNumber: 'PO-2024-003',
        supplierName: 'บริษัท อุปกรณ์คอมพิวเตอร์ จำกัด',
        amount: 80000,
        orderDate: '2024-01-05',
        deliveryDate: '2024-01-15',
        status: 'cancelled',
    },
];

const PurchaseOrdersPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [data] = useState<PurchaseOrderData[]>(mockData);

    const columns: ColumnsType<PurchaseOrderData> = [
        {
            title: 'เลขที่ใบสั่งซื้อ',
            dataIndex: 'poNumber',
            key: 'poNumber',
            sorter: (a, b) => a.poNumber.localeCompare(b.poNumber),
        },
        {
            title: 'ชื่อผู้จำหน่าย',
            dataIndex: 'supplierName',
            key: 'supplierName',
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) =>
                record.supplierName.toLowerCase().includes(value.toString().toLowerCase()),
        },
        {
            title: 'จำนวนเงิน',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `฿${amount.toLocaleString()}`,
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'วันที่สั่งซื้อ',
            dataIndex: 'orderDate',
            key: 'orderDate',
            sorter: (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
        },
        {
            title: 'กำหนดส่ง',
            dataIndex: 'deliveryDate',
            key: 'deliveryDate',
            sorter: (a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime(),
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
                { text: 'รออนุมัติ', value: 'pending' },
                { text: 'รับสินค้าแล้ว', value: 'received' },
                { text: 'ยกเลิก', value: 'cancelled' },
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
                    {record.status === 'pending' && (
                        <>
                            <Button type="link" size="small" style={{ color: 'green' }}>
                                รับสินค้า
                            </Button>
                            <Button type="link" size="small" danger>
                                ยกเลิก
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const handleNewPurchaseOrder = () => {
        console.log('Navigate to new purchase order form');
    };

    return (
        <DefaultLayout>
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">ใบสั่งซื้อ</h1>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleNewPurchaseOrder}
                            size="large"
                        >
                            สร้างใบสั่งซื้อใหม่
                        </Button>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="ค้นหาชื่อผู้จำหน่าย..."
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
                        dataSource={data}
                        pagination={{
                            total: data.length,
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

export default PurchaseOrdersPage;
