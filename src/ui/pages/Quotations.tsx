import React, { useState } from 'react';
import { Table, Button, Tag, Space, Card, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DefaultLayout from '@/layouts/default';

interface QuotationData {
    key: string;
    quotationNumber: string;
    customerName: string;
    amount: number;
    date: string;
    status: 'pending' | 'expired' | 'approved';
}

const statusConfig = {
    pending: { color: 'orange', text: 'รออนุมัติ' },
    expired: { color: 'red', text: 'พ้นกำหนด' },
    approved: { color: 'green', text: 'อนุมัติแล้ว' },
};

const mockData: QuotationData[] = [
    {
        key: '1',
        quotationNumber: 'QT-2024-001',
        customerName: 'บริษัท ABC จำกัด',
        amount: 50000,
        date: '2024-01-15',
        status: 'pending',
    },
    {
        key: '2',
        quotationNumber: 'QT-2024-002',
        customerName: 'บริษัท XYZ จำกัด',
        amount: 75000,
        date: '2024-01-10',
        status: 'approved',
    },
    {
        key: '3',
        quotationNumber: 'QT-2024-003',
        customerName: 'ห้างหุ้นส่วน DEF',
        amount: 30000,
        date: '2024-01-05',
        status: 'expired',
    },
];

const QuotationsPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [data] = useState<QuotationData[]>(mockData);

    const columns: ColumnsType<QuotationData> = [
        {
            title: 'เลขที่ใบเสนอราคา',
            dataIndex: 'quotationNumber',
            key: 'quotationNumber',
            sorter: (a, b) => a.quotationNumber.localeCompare(b.quotationNumber),
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
            title: 'วันที่',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
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
                { text: 'อนุมัติแล้ว', value: 'approved' },
                { text: 'พ้นกำหนด', value: 'expired' },
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
                        <Button type="link" size="small" danger>
                            ยกเลิก
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const handleNewQuotation = () => {
        // TODO: Navigate to new quotation form
        console.log('Navigate to new quotation form');
    };

    return (
        <DefaultLayout>
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">ใบเสนอราคา</h1>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleNewQuotation}
                            size="large"
                        >
                            สร้างใบเสนอราคาใหม่
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

export default QuotationsPage;
