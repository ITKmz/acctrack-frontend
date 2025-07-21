import { useState, useEffect } from 'react';

// Local type definitions (matching the ones in renderer.d.ts)
export interface BusinessData {
    id?: string;
    businessType: string;
    registrationNumber: string;
    officeType: string;
    branch?: string;
    individualDetails: {
        type: string;
    };
    juristicDetails: {
        type: string;
    };
    businessName: string;
    businessDescription: string;
    registrationDate: string;
    vatRegistered: boolean;
    vatDetails: {
        vatRegistrationDate?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductData {
    id?: string;
    name: string;
    description?: string;
    category?: string;
    unitPrice: number;
    stock: number;
    minStock: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface QuotationData {
    id?: string;
    quotationNumber: string;
    customerName: string;
    customerAddress?: string;
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        amount: number;
    }>;
    subtotal: number;
    vat?: number;
    total: number;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    createdAt?: string;
    updatedAt?: string;
}

// Database service for interacting with SQLite through Electron
export const useDatabase = () => {
    const [isElectron, setIsElectron] = useState(false);

    useEffect(() => {
        // Detect if we're in an Electron environment
        if (window?.electron) {
            setIsElectron(true);
        }
    }, []);

    // Business Data Operations
    const saveBusinessData = async (data: BusinessData) => {
        if (isElectron && window.electron.saveBusinessData) {
            return await window.electron.saveBusinessData(data);
        } else {
            // Fallback to localStorage
            localStorage.setItem('businessData', JSON.stringify(data));
            return { success: true };
        }
    };

    const getBusinessData = async (): Promise<BusinessData | null> => {
        if (isElectron && window.electron.getBusinessData) {
            const result = await window.electron.getBusinessData();
            if (result && Object.keys(result).length > 0) {
                return result as BusinessData;
            }
            return null;
        } else {
            // Fallback to localStorage
            const saved = localStorage.getItem('businessData');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return null;
                }
            }
            return null;
        }
    };

    // Product Operations
    const saveProduct = async (data: ProductData) => {
        if (isElectron && window.electron.saveProduct) {
            return await window.electron.saveProduct(data);
        } else {
            // Fallback to localStorage
            const products = await getProducts();
            const newProduct = { 
                ...data, 
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const updatedProducts = [...products, newProduct];
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            return { success: true, id: newProduct.id };
        }
    };

    const getProducts = async (): Promise<ProductData[]> => {
        if (isElectron && window.electron.getProducts) {
            const result = await window.electron.getProducts();
            return result.success ? result.data || [] : [];
        } else {
            // Fallback to localStorage
            const saved = localStorage.getItem('products');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return [];
                }
            }
            return [];
        }
    };

    const updateProduct = async (id: string, data: Partial<ProductData>) => {
        if (isElectron && window.electron.updateProduct) {
            return await window.electron.updateProduct(id, data);
        } else {
            // Fallback to localStorage
            const products = await getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { 
                    ...products[index], 
                    ...data,
                    updatedAt: new Date().toISOString()
                };
                localStorage.setItem('products', JSON.stringify(products));
                return { success: true };
            }
            return { success: false, error: 'Product not found' };
        }
    };

    const deleteProduct = async (id: string) => {
        if (isElectron && window.electron.deleteProduct) {
            return await window.electron.deleteProduct(id);
        } else {
            // Fallback to localStorage
            const products = await getProducts();
            const filtered = products.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(filtered));
            return { success: true };
        }
    };

    // Quotation Operations
    const saveQuotation = async (data: QuotationData) => {
        if (isElectron && window.electron.saveQuotation) {
            return await window.electron.saveQuotation(data);
        } else {
            // Fallback to localStorage
            const quotations = await getQuotations();
            const newQuotation = { 
                ...data, 
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const updatedQuotations = [...quotations, newQuotation];
            localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
            return { success: true, id: newQuotation.id };
        }
    };

    const getQuotations = async (): Promise<QuotationData[]> => {
        if (isElectron && window.electron.getQuotations) {
            const result = await window.electron.getQuotations();
            return result.success ? result.data || [] : [];
        } else {
            // Fallback to localStorage
            const saved = localStorage.getItem('quotations');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return [];
                }
            }
            return [];
        }
    };

    return {
        isElectron,
        // Business data
        saveBusinessData,
        getBusinessData,
        // Products
        saveProduct,
        getProducts,
        updateProduct,
        deleteProduct,
        // Quotations
        saveQuotation,
        getQuotations,
    };
};

// Hook for business data specifically
export const useBusinessData = () => {
    const [businessData, setBusinessData] = useState<BusinessData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { saveBusinessData: save, getBusinessData: get } = useDatabase();

    const loadBusinessData = async () => {
        try {
            setLoading(true);
            const data = await get();
            setBusinessData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load business data');
        } finally {
            setLoading(false);
        }
    };

    const saveBusinessDataState = async (data: BusinessData) => {
        try {
            const result = await save(data);
            if (result.success) {
                setBusinessData(data);
                setError(null);
                return result;
            } else {
                setError((result as any).error || 'Failed to save business data');
                return result;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save business data';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    useEffect(() => {
        loadBusinessData();
    }, []);

    return {
        businessData,
        loading,
        error,
        saveBusinessData: saveBusinessDataState,
        refreshBusinessData: loadBusinessData,
    };
};

// Hook for products
export const useProducts = () => {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { 
        saveProduct: save, 
        getProducts: get, 
        updateProduct: update, 
        deleteProduct: remove 
    } = useDatabase();

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await get();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const saveProduct = async (data: ProductData) => {
        try {
            const result = await save(data);
            if (result.success) {
                await loadProducts(); // Refresh the list
                setError(null);
            } else {
                setError((result as any).error || 'Failed to save product');
            }
            return result;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save product';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const updateProduct = async (id: string, data: Partial<ProductData>) => {
        try {
            const result = await update(id, data);
            if (result.success) {
                await loadProducts(); // Refresh the list
                setError(null);
            } else {
                setError((result as any).error || 'Failed to update product');
            }
            return result;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to update product';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const result = await remove(id);
            if (result.success) {
                await loadProducts(); // Refresh the list
                setError(null);
            } else {
                setError((result as any).error || 'Failed to delete product');
            }
            return result;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to delete product';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return {
        products,
        loading,
        error,
        saveProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: loadProducts,
    };
};
