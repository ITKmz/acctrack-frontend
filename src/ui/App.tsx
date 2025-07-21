import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import FirstTimeSetup from '@/components/FirstTimeSetup';

// Import dev mode utilities in development
if (import.meta.env.DEV) {
    import('@/utils/devMode');
}

function App() {
    const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if this is the first time running the app
    useEffect(() => {
        checkFirstTimeSetup();
    }, []);

    const checkFirstTimeSetup = async () => {
        try {
            if (window?.electron?.getStorageSettings) {
                // Running in Electron
                const settings = await window.electron.getStorageSettings();
                if (!settings) {
                    setShowFirstTimeSetup(true);
                }
            } else {
                // Running in browser - check localStorage
                const setupCompleted = localStorage.getItem('acctrack-setup-completed');
                const storageSettings = localStorage.getItem('acctrack-storage-settings');
                
                if (!setupCompleted || !storageSettings) {
                    setShowFirstTimeSetup(true);
                }
            }
        } catch (error) {
            console.error('Error checking first-time setup:', error);
            // If there's an error, assume first-time setup is needed
            setShowFirstTimeSetup(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFirstTimeSetupComplete = (selectedPath?: string) => {
        setShowFirstTimeSetup(false);
        console.log('First-time setup completed with path:', selectedPath || 'default');
    };

    // Show loading or first-time setup
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <FirstTimeSetup
                visible={showFirstTimeSetup}
                onComplete={handleFirstTimeSetupComplete}
            />
            
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
        </>
    );
}

export default App;
