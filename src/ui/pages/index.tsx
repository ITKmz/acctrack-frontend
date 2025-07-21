import { Card, Row, Col, Statistic, Table, Tag, Progress } from 'antd';
import {
    FileTextOutlined,
    BoxPlotOutlined,
    ShoppingCartOutlined,
    RiseOutlined,
    FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DefaultLayout from '@/layouts/default';

interface RecentActivity {
    key: string;
    type: 'quotation' | 'invoice' | 'purchase-order';
    number: string;
    customer: string;
    amount: number;
    date: string;
    status: string;
}

interface ProductStock {
    key: string;
    productName: string;
    currentStock: number;
    minStock: number;
    status: 'normal' | 'low' | 'out';
}

const recentActivities: RecentActivity[] = [
    {
        key: '1',
        type: 'quotation',
        number: 'QT-2024-001',
        customer: 'บริษัท ABC จำกัด',
        amount: 50000,
        date: '2024-01-15',
        status: 'รออนุมัติ',
    },
    {
        key: '2',
        type: 'invoice',
        number: 'INV-2024-001',
        customer: 'บริษัท XYZ จำกัด',
        amount: 75000,
        date: '2024-01-14',
        status: 'ชำระแล้ว',
    },
    {
        key: '3',
        type: 'purchase-order',
        number: 'PO-2024-001',
        customer: 'บริษัท วัสดุก่อสร้าง จำกัด',
        amount: 25000,
        date: '2024-01-13',
        status: 'รอรับสินค้า',
    },
];

const lowStockProducts: ProductStock[] = [
    {
        key: '1',
        productName: 'เมาส์คอมพิวเตอร์',
        currentStock: 5,
        minStock: 10,
        status: 'low',
    },
    {
        key: '2',
        productName: 'เก้าอี้สำนักงาน',
        currentStock: 0,
        minStock: 5,
        status: 'out',
    },
    {
        key: '3',
        productName: 'กระดาษ A4',
        currentStock: 15,
        minStock: 20,
        status: 'low',
    },
];

const typeLabels = {
    quotation: 'ใบเสนอราคา',
    invoice: 'ใบแจ้งหนี้',
    'purchase-order': 'ใบสั่งซื้อ',
};

export default function IndexPage() {
    const activityColumns: ColumnsType<RecentActivity> = [
        {
            title: 'ประเภท',
            dataIndex: 'type',
            key: 'type',
            render: (type: keyof typeof typeLabels) => (
                <Tag color={
                    type === 'quotation' ? 'blue' : 
                    type === 'invoice' ? 'green' : 'orange'
                }>
                    {typeLabels[type]}
                </Tag>
            ),
        },
        {
            title: 'เลขที่เอกสาร',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'ลูกค้า/ผู้จำหน่าย',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'จำนวนเงิน',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `฿${amount.toLocaleString()}`,
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    const stockColumns: ColumnsType<ProductStock> = [
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'คลังสินค้า',
            key: 'stock',
            render: (_, record) => (
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span>{record.currentStock}/{record.minStock}</span>
                        <Tag color={record.status === 'out' ? 'red' : 'orange'}>
                            {record.status === 'out' ? 'สินค้าหมด' : 'สินค้าเหลือน้อย'}
                        </Tag>
                    </div>
                    <Progress
                        percent={(record.currentStock / record.minStock) * 100}
                        size="small"
                        status={record.status === 'out' ? 'exception' : 'active'}
                        showInfo={false}
                    />
                </div>
            ),
        },
    ];

    return (
        <DefaultLayout>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">แดชบอร์ด</h1>
                    <p className="text-gray-600">ภาพรวมธุรกิจของคุณ</p>
                </div>

                {/* Key Metrics */}
                <Row gutter={16} className="mb-6">
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="รายรับเดือนนี้"
                                value={485000}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<RiseOutlined />}
                                suffix="฿"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="รายจ่ายเดือนนี้"
                                value={125000}
                                precision={0}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FallOutlined />}
                                suffix="฿"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="ใบเสนอราคารอดำเนินการ"
                                value={8}
                                valueStyle={{ color: '#fa8c16' }}
                                prefix={<FileTextOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="สินค้าในคลัง"
                                value={245}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<BoxPlotOutlined />}
                                suffix="รายการ"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Charts Row */}
                <Row gutter={16} className="mb-6">
                    <Col xs={24} lg={12}>
                        <Card title="กำไร/ขาดทุนรายเดือน" className="h-80">
                            <div className="flex items-center justify-center h-48">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-600 mb-2">
                                        ฿360,000
                                    </div>
                                    <div className="text-lg text-gray-600">กำไรสุทธิเดือนนี้</div>
                                    <div className="text-sm text-green-600 mt-2">
                                        <RiseOutlined /> เพิ่มขึ้น 15% จากเดือนก่อน
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="สถิติการขาย" className="h-80">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>ใบเสนอราคา</span>
                                    <div className="flex items-center gap-2">
                                        <Progress percent={75} size="small" className="w-24" />
                                        <span>15 ใบ</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>ใบแจ้งหนี้</span>
                                    <div className="flex items-center gap-2">
                                        <Progress percent={60} size="small" className="w-24" />
                                        <span>12 ใบ</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>ใบสั่งซื้อ</span>
                                    <div className="flex items-center gap-2">
                                        <Progress percent={40} size="small" className="w-24" />
                                        <span>8 ใบ</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Tables Row */}
                <Row gutter={16}>
                    <Col xs={24} lg={14}>
                        <Card title="กิจกรรมล่าสุด">
                            <Table
                                columns={activityColumns}
                                dataSource={recentActivities}
                                pagination={false}
                                size="small"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={10}>
                        <Card 
                            title="แจ้งเตือนสินค้า" 
                            extra={
                                <Tag color="red" icon={<ShoppingCartOutlined />}>
                                    {lowStockProducts.length} รายการ
                                </Tag>
                            }
                        >
                            <Table
                                columns={stockColumns}
                                dataSource={lowStockProducts}
                                pagination={false}
                                size="small"
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </DefaultLayout>
    );
}
