import DefaultLayout from '@/layouts/default';
import BusinessForm from '@/components/settings/BusinessForm';

export default function IndexPage() {
    return (
        <DefaultLayout>
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>
            <BusinessForm />
        </DefaultLayout>
    );
}
