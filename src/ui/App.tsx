import { Routes, Route } from 'react-router-dom';
import IndexPage from '@/pages/index';

function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
        </Routes>
    );
}

export default App;
