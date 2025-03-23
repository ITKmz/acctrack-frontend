import { Routes, Route, Navigate } from 'react-router-dom';
import IndexPage from '@/pages/index';
import IncomePage from '@/pages/Income';
import ExpensesPage from '@/pages/Expenses';
import ProductsPage from '@/pages/Products';
import SettingsPage from '@/pages/Settings';

function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/products" element={<ProductsPage />} />

            <Route path="/settings" element={<Navigate to="/settings/company" />} />
            <Route path="/settings/company" element={<SettingsPage />} />
        </Routes>
    );
}

export default App;
