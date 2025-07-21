import React, { useState } from 'react';
import { Table, Button, Tag, Space, Card, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DefaultLayout from '@/layouts/default';

interface InvoiceData {
    key: string;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    date: string;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
}

const statusConfig = {
    pending: { color: 'orange', text: 'รอชำระ' },
    paid: { color: 'green', text: 'ชำระแล้ว' },
    overdue: { color: 'red', text: 'เกินกำหนด' },
};

const mockData: InvoiceData[] = [
    {
        key: '1',
        invoiceNumber: 'INV-2024-001',
        customerName: 'บริษัท ABC จำกัด',
        amount: 50000,
        date: '2024-01-15',
        dueDate: '2024-02-15',
        status: 'pending',
    },
    {
        key: '2',
        invoiceNumber: 'INV-2024-002',
        customerName: 'บริษัท XYZ จำกัด',
        amount: 75000,
        date: '2024-01-10',
        dueDate: '2024-02-10',
        status: 'paid',
    },
    {
        key: '3',
        invoiceNumber: 'INV-2024-003',
        customerName: 'ห้างหุ้นส่วน DEF',
        amount: 30000,
        date: '2024-01-05',
        dueDate: '2024-02-05',
        status: 'overdue',
    },
];

const InvoicesPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [data] = useState<InvoiceData[]>(mockData);

    const columns: ColumnsType<InvoiceData> = [
        {
            title: 'เลขที่ใบแจ้งหนี้',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
            sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customerName',
            key: 'customerName',
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) =>
                record.customerName.toLowerCase().includes(value.toString().toLowerCase()),
        },
        {
            title: 'จำนวนเงิน',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `฿${amount.toLocaleString()}`,
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'วันที่ออกใบแจ้งหนี้',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: 'กำหนดชำระ',
            dataIndex: 'dueDate',
            key: 'dueDate',
            sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
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
                { text: 'รอชำระ', value: 'pending' },
                { text: 'ชำระแล้ว', value: 'paid' },
                { text: 'เกินกำหนด', value: 'overdue' },
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
                        <Button type="link" size="small" style={{ color: 'green' }}>
                            ชำระแล้ว
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const handleNewInvoice = () => {
        console.log('Navigate to new invoice form');
    };

    return (
        <DefaultLayout>
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">ใบแจ้งหนี้</h1>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleNewInvoice}
                            size="large"
                        >
                            สร้างใบแจ้งหนี้ใหม่
                        </Button>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="ค้นหาชื่อลูกค้า..."
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

export default InvoicesPage;
