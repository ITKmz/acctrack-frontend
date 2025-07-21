import { contextBridge, ipcRenderer } from 'electron';

// Define types for the data
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

// Expose methods to the renderer process
contextBridge.exposeInMainWorld('electron', {
    // Business data operations
    saveBusinessData: (businessData: BusinessData) =>
        ipcRenderer.invoke('saveBusinessData', businessData),
    getBusinessData: () => 
        ipcRenderer.invoke('getBusinessData'),

    // Product operations
    saveProduct: (productData: ProductData) =>
        ipcRenderer.invoke('saveProduct', productData),
    getProducts: () =>
        ipcRenderer.invoke('getProducts'),
    updateProduct: (id: string, data: Partial<ProductData>) =>
        ipcRenderer.invoke('updateProduct', { id, data }),
    deleteProduct: (id: string) =>
        ipcRenderer.invoke('deleteProduct', id),

    // Quotation operations
    saveQuotation: (quotationData: QuotationData) =>
        ipcRenderer.invoke('saveQuotation', quotationData),
    getQuotations: () =>
        ipcRenderer.invoke('getQuotations'),

    // Legacy support for existing components
    saveFile: (id: string, businessData: BusinessData) =>
        ipcRenderer.invoke('saveBusinessData', businessData),
    readFile: (id: string) => 
        ipcRenderer.invoke('getBusinessData'),
});
