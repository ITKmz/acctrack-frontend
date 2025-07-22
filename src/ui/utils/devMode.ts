// Development mode utilities for localStorage management
export const DevModeUtils = {
    // Check if we're in development mode with localStorage
    isDevMode(): boolean {
        try {
            const settings = localStorage.getItem('acctrack-storage-settings');
            if (settings) {
                const parsed = JSON.parse(settings);
                return parsed.storageType === 'localStorage' && parsed.isDevelopment === true;
            }
        } catch (error) {
            console.error('Error checking dev mode:', error);
        }
        return false;
    },

    // Get mock business data for development
    getMockBusinessData() {
        return {
            id: 'dev-business-1',
            businessType: 'individual',
            registrationNumber: '1234567890123',
            officeType: 'main',
            individualDetails: { type: 'individual' },
            juristicDetails: { type: 'juristic' },
            businessName: 'ธุรกิจทดสอบ Dev Mode',
            businessDescription: 'ธุรกิจสำหรับการพัฒนาและทดสอบระบบ',
            registrationDate: '2024-01-01',
            vatRegistered: true,
            vatDetails: { vatRegistrationDate: '2024-01-01' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    },

    // Get mock products for development
    getMockProducts() {
        return [
            {
                id: 'dev-product-1',
                name: 'สินค้าทดสอบ 1',
                description: 'สินค้าสำหรับทดสอบระบบ',
                category: 'ทดสอบ',
                unitPrice: 100,
                stock: 50,
                minStock: 10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'dev-product-2',
                name: 'สินค้าทดสอบ 2',
                description: 'สินค้าสำหรับทดสอบระบบ 2',
                category: 'ทดสอบ',
                unitPrice: 250,
                stock: 30,
                minStock: 5,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    },

    // Initialize dev mode with sample data
    initDevMode() {
        if (!this.isDevMode()) return;

        // Set up mock data if not exists
        if (!localStorage.getItem('acctrack-business-data')) {
            localStorage.setItem('acctrack-business-data', JSON.stringify(this.getMockBusinessData()));
        }

        if (!localStorage.getItem('acctrack-products')) {
            localStorage.setItem('acctrack-products', JSON.stringify(this.getMockProducts()));
        }

        console.log('🚀 Development mode initialized with sample data');
    },

    // Clear all dev mode data
    clearDevData() {
        const keys = [
            'acctrack-storage-settings',
            'acctrack-setup-completed',
            'acctrack-business-data',
            'acctrack-products'
        ];

        keys.forEach(key => {
            localStorage.removeItem(key);
        });

        console.log('🧹 Development mode data cleared');
    },

    // Log current dev mode state
    logDevState() {
        if (!this.isDevMode()) {
            console.log('❌ Not in development mode');
            return;
        }

        console.log('🔧 Development Mode Status:');
        console.log('- Storage Type: localStorage');
        console.log('- Setup Completed:', localStorage.getItem('acctrack-setup-completed'));
        console.log('- Business Data:', !!localStorage.getItem('acctrack-business-data'));
        console.log('- Products:', !!localStorage.getItem('acctrack-products'));
    }
};

// Make it available globally in development
if (import.meta.env.DEV) {
    (window as any).DevModeUtils = DevModeUtils;
    console.log('🛠️ DevModeUtils available globally. Try DevModeUtils.logDevState()');
}
