export {};

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

export interface DataStorageSettings {
    storageType: 'sqlite' | 'cloud' | 'localStorage';
    autoBackup: boolean;
    backupInterval: number; // in hours
    databasePath?: string;
    isDevelopment?: boolean;
}

export interface MessageBoxOptions {
    type?: 'none' | 'info' | 'error' | 'question' | 'warning';
    title?: string;
    message?: string;
    detail?: string;
    buttons?: string[];
}

export interface OpenDialogOptions {
    title?: string;
    defaultPath?: string;
    properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles'>;
    filters?: Array<{ name: string; extensions: string[] }>;
}

declare global {
    interface Window {
        electron: {
            // Business data operations
            saveBusinessData: (
                data: BusinessData,
            ) => Promise<{ success: boolean; error?: string }>;
            getBusinessData: () => Promise<BusinessData | {}>;
            
            // Product operations
            saveProduct: (data: ProductData) => Promise<{ success: boolean; id?: string; error?: string }>;
            getProducts: () => Promise<{ success: boolean; data?: ProductData[]; error?: string }>;
            updateProduct: (id: string, data: Partial<ProductData>) => Promise<{ success: boolean; error?: string }>;
            deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
            
            // Quotation operations
            saveQuotation: (data: QuotationData) => Promise<{ success: boolean; id?: string; error?: string }>;
            getQuotations: () => Promise<{ success: boolean; data?: QuotationData[]; error?: string }>;

            // Storage settings operations
            saveStorageSettings: (settings: DataStorageSettings) => Promise<{ success: boolean; error?: string }>;
            getStorageSettings: () => Promise<DataStorageSettings | null>;
            checkFolderForExistingData: (folderPath: string) => Promise<{ hasData: boolean; tableCount?: number; error?: string }>;
            
            // Recent folders operations
            getRecentFolders: () => Promise<string[]>;
            addToRecentFolders: (folderPath: string) => Promise<void>;
            // Dialog operations
            showMessageBox: (options: MessageBoxOptions) => Promise<{ response: number; checkboxChecked?: boolean }>;
            showOpenDialog: (options: OpenDialogOptions) => Promise<{ canceled: boolean; filePaths: string[] }>;

            // Legacy support (maintained for backward compatibility)
            saveFile: (
                userId: string,
                data: BusinessData,
            ) => Promise<{ success: boolean; error?: string }>;
            readFile: (userId: string) => Promise<BusinessData | {}>;
        };
    }
}
