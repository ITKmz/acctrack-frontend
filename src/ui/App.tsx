import { Routes, Route } from 'react-router-dom';
import IndexPage from '@/pages/index';
import IncomePage from '@/pages/Income';
import ExpensesPage from '@/pages/Expenses';
import ProductsPage from '@/pages/Products';

function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/products" element={<ProductsPage />} />
        </Routes>
    );
}

export default App;
