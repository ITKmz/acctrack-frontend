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

export interface ContactAddressData {
    id?: string;
    // ที่อยู่
    building?: string;           // อาคาร
    roomNumber?: string;         // ห้องเลขที่
    floor?: string;             // ชั้นที่
    village?: string;           // หมู่บ้าน
    houseNumber: string;        // บ้านเลขที่* (required)
    moo?: string;               // หมู่ที่
    soi?: string;               // ซอย/ตรอก
    road?: string;              // ถนน
    subDistrict: string;        // แขวง/ตำบล* (required)
    district: string;           // เขต/อำเภอ* (required)
    province: string;           // จังหวัด* (required)
    country: string;            // ประเทศ* (required)
    postalCode: string;         // รหัสไปรษณีย์* (required)
    // เบอร์โทรศัพท์
    phoneNumber: string;        // required
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
            
            // Contact Address operations
            saveContactData: (data: ContactAddressData) => Promise<{ success: boolean; id?: string; error?: string }>;
            getContactData: () => Promise<{ success: boolean; data?: ContactAddressData; error?: string }>;

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
