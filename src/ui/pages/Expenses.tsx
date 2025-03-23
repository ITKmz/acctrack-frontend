import { useState, useEffect } from 'react';
import { Input, Button, Form } from 'antd';
import { saveAs } from 'file-saver';
import DefaultLayout from '@/layouts/default';

interface FormData {
    name: string;
    email: string;
}

export default function ExpensesPage() {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
    const [isElectron, setIsElectron] = useState<boolean>(false);

    useEffect(() => {
        // Detect if we're in an Electron environment
        if (
            window &&
            window.process &&
            window.process.versions &&
            window.process.versions.electron
        ) {
            setIsElectron(true);
        }
    }, []);

    const onFinish = (values: FormData) => {
        setFormData(values);
    };

    const handleSave = () => {
        const jsonData = JSON.stringify(formData, null, 2);

        if (isElectron) {
            // In Electron, send the data to the main process to save the file
            window.electron.saveFile(jsonData);
        } else {
            // In the web, use file-saver to trigger the download
            const blob = new Blob([jsonData], { type: 'application/json' });
            saveAs(blob, 'form-data.json');
        }
    };

    return (
        <DefaultLayout>
            <h1 className="text-2xl font-bold mb-4">Expenses Page</h1>
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                initialValues={formData}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        { required: true, message: 'Please input your name!' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>

            <Button type="default" className="mt-4" onClick={handleSave}>
                Save
            </Button>
        </DefaultLayout>
    );
}
