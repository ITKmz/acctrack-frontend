import { Routes, Route, Navigate } from 'react-router-dom';
import IndexPage from '@/pages/index';
import IncomePage from '@/pages/Income';
import ExpensesPage from '@/pages/Expenses';
import ProductsPage from '@/pages/Products';
import SettingsPage from '@/pages/Settings';
import QuotationsPage from '@/pages/Quotations';
import InvoicesPage from '@/pages/Invoices';
import PurchaseOrdersPage from '@/pages/PurchaseOrders';
import ProductListPage from '@/pages/ProductList';
import ProductCategoriesPage from '@/pages/ProductCategories';

function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/income/quotations" element={<QuotationsPage />} />
            <Route path="/income/invoices" element={<InvoicesPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/expenses/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/list" element={<ProductListPage />} />
            <Route path="/products/categories" element={<ProductCategoriesPage />} />

            <Route
                path="/settings"
                element={<Navigate to="/settings/company" />}
            />
            <Route path="/settings/company" element={<SettingsPage />} />
        </Routes>
    );
}

export default App;
