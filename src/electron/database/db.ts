import sqlite3 from 'sqlite3';
import { app } from 'electron';
import path from 'path';

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

export interface ContactData {
    id?: string;
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
    phoneNumber: string;        // required
    createdAt?: string;
    updatedAt?: string;
}

class Database {
    private db: sqlite3.Database | null = null;
    private dbPath: string;

    constructor(customPath?: string) {
        if (customPath) {
            this.dbPath = path.join(customPath, 'acctrack.db');
        } else {
            this.dbPath = path.join(app.getPath('userData'), 'acctrack.db');
        }
    }

    // Method to change database path (requires re-initialization)
    async changeDatabasePath(newPath: string): Promise<void> {
        // Close current database connection
        if (this.db) {
            await this.close();
        }
        
        // Update path
        this.dbPath = path.join(newPath, 'acctrack.db');
        
        // Re-initialize with new path
        await this.initialize();
    }

    async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                    return;
                }
                console.log('Connected to SQLite database at:', this.dbPath);
                this.createTables()
                    .then(() => resolve())
                    .catch(reject);
            });
        });
    }

    private async createTables(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const createTablesSQL = `
            -- Business data table
            CREATE TABLE IF NOT EXISTS business_data (
                id TEXT PRIMARY KEY DEFAULT 'default',
                business_type TEXT NOT NULL,
                registration_number TEXT,
                office_type TEXT,
                branch TEXT,
                individual_details TEXT, -- JSON string
                juristic_details TEXT, -- JSON string
                business_name TEXT,
                business_description TEXT,
                registration_date TEXT,
                vat_registered BOOLEAN DEFAULT FALSE,
                vat_details TEXT, -- JSON string
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            -- Products table
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
                name TEXT NOT NULL,
                description TEXT,
                category TEXT,
                unit_price REAL NOT NULL,
                stock INTEGER DEFAULT 0,
                min_stock INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            -- Contact data table
            CREATE TABLE IF NOT EXISTS contact_data (
                id TEXT PRIMARY KEY DEFAULT 'default',
                building TEXT,
                room_number TEXT,
                floor TEXT,
                village TEXT,
                house_number TEXT NOT NULL,
                moo TEXT,
                soi TEXT,
                road TEXT,
                sub_district TEXT NOT NULL,
                district TEXT NOT NULL,
                province TEXT NOT NULL,
                country TEXT NOT NULL,
                postal_code TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;

        return new Promise((resolve, reject) => {
            this.db!.exec(createTablesSQL, (err) => {
                if (err) {
                    console.error('Error creating tables:', err);
                    reject(err);
                } else {
                    console.log('Database tables created successfully');
                    resolve();
                }
            });
        });
    }

    // Business Data Operations
    async saveBusinessData(data: BusinessData): Promise<{ success: boolean; error?: string }> {
        if (!this.db) throw new Error('Database not initialized');

        const sql = `
            INSERT OR REPLACE INTO business_data (
                id, business_type, registration_number, office_type, branch,
                individual_details, juristic_details, business_name, business_description,
                registration_date, vat_registered, vat_details, updated_at
            ) VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        return new Promise((resolve) => {
            this.db!.run(sql, [
                data.businessType,
                data.registrationNumber,
                data.officeType,
                data.branch || null,
                JSON.stringify(data.individualDetails),
                JSON.stringify(data.juristicDetails),
                data.businessName,
                data.businessDescription,
                data.registrationDate,
                data.vatRegistered ? 1 : 0,
                JSON.stringify(data.vatDetails)
            ], function(err) {
                if (err) {
                    console.error('Error saving business data:', err);
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    }

    async getBusinessData(): Promise<BusinessData | null> {
        if (!this.db) throw new Error('Database not initialized');

        const sql = 'SELECT * FROM business_data WHERE id = ? ORDER BY updated_at DESC LIMIT 1';

        return new Promise((resolve, reject) => {
            this.db!.get(sql, ['default'], (err, row: any) => {
                if (err) {
                    console.error('Error getting business data:', err);
                    reject(err);
                    return;
                }

                if (!row) {
                    resolve(null);
                    return;
                }

                try {
                    const businessData: BusinessData = {
                        id: row.id,
                        businessType: row.business_type,
                        registrationNumber: row.registration_number,
                        officeType: row.office_type,
                        branch: row.branch,
                        individualDetails: JSON.parse(row.individual_details || '{}'),
                        juristicDetails: JSON.parse(row.juristic_details || '{}'),
                        businessName: row.business_name,
                        businessDescription: row.business_description,
                        registrationDate: row.registration_date,
                        vatRegistered: Boolean(row.vat_registered),
                        vatDetails: JSON.parse(row.vat_details || '{}'),
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    };
                    resolve(businessData);
                } catch (parseErr) {
                    console.error('Error parsing business data:', parseErr);
                    reject(parseErr);
                }
            });
        });
    }

    // Product Operations
    async saveProduct(data: ProductData): Promise<{ success: boolean; id?: string; error?: string }> {
        if (!this.db) throw new Error('Database not initialized');

        const sql = `
            INSERT INTO products (name, description, category, unit_price, stock, min_stock)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        return new Promise((resolve) => {
            this.db!.run(sql, [
                data.name,
                data.description || null,
                data.category || null,
                data.unitPrice,
                data.stock || 0,
                data.minStock || 0
            ], function(err) {
                if (err) {
                    console.error('Error saving product:', err);
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({ success: true, id: this.lastID?.toString() });
                }
            });
        });
    }

    async getProducts(): Promise<ProductData[]> {
        if (!this.db) throw new Error('Database not initialized');

        const sql = 'SELECT * FROM products ORDER BY created_at DESC';

        return new Promise((resolve, reject) => {
            this.db!.all(sql, [], (err, rows: any[]) => {
                if (err) {
                    console.error('Error getting products:', err);
                    reject(err);
                    return;
                }

                const products: ProductData[] = rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    category: row.category,
                    unitPrice: row.unit_price,
                    stock: row.stock,
                    minStock: row.min_stock,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                }));

                resolve(products);
            });
        });
    }

    async updateProduct(id: string, data: Partial<ProductData>): Promise<{ success: boolean; error?: string }> {
        if (!this.db) throw new Error('Database not initialized');

        const fields: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
        if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
        if (data.category !== undefined) { fields.push('category = ?'); values.push(data.category); }
        if (data.unitPrice !== undefined) { fields.push('unit_price = ?'); values.push(data.unitPrice); }
        if (data.stock !== undefined) { fields.push('stock = ?'); values.push(data.stock); }
        if (data.minStock !== undefined) { fields.push('min_stock = ?'); values.push(data.minStock); }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

        return new Promise((resolve) => {
            this.db!.run(sql, values, function(err) {
                if (err) {
                    console.error('Error updating product:', err);
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    }

    async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
        if (!this.db) throw new Error('Database not initialized');

        const sql = 'DELETE FROM products WHERE id = ?';

        return new Promise((resolve) => {
            this.db!.run(sql, [id], function(err) {
                if (err) {
                    console.error('Error deleting product:', err);
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    }

    // Contact Data Operations
    async saveContactData(data: ContactData): Promise<{ success: boolean; error?: string }> {
        if (!this.db) throw new Error('Database not initialized');

        const sql = `
            INSERT OR REPLACE INTO contact_data (
                id, building, room_number, floor, village, house_number, moo, soi, road,
                sub_district, district, province, country, postal_code, phone_number, updated_at
            ) VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        return new Promise((resolve) => {
            this.db!.run(sql, [
                data.building || null,
                data.roomNumber || null,
                data.floor || null,
                data.village || null,
                data.houseNumber,
                data.moo || null,
                data.soi || null,
                data.road || null,
                data.subDistrict,
                data.district,
                data.province,
                data.country,
                data.postalCode,
                data.phoneNumber
            ], function (err) {
                if (err) {
                    console.error('Error saving contact data:', err);
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    }

    async getContactData(): Promise<ContactData | null> {
        if (!this.db) throw new Error('Database not initialized');

        const sql = 'SELECT * FROM contact_data WHERE id = ? ORDER BY updated_at DESC LIMIT 1';

        return new Promise((resolve, reject) => {
            this.db!.get(sql, ['default'], (err, row: any) => {
                if (err) {
                    console.error('Error getting contact data:', err);
                    reject(err);
                    return;
                }

                if (!row) {
                    resolve(null);
                    return;
                }

                try {
                    const contactData: ContactData = {
                        id: row.id,
                        building: row.building,
                        roomNumber: row.room_number,
                        floor: row.floor,
                        village: row.village,
                        houseNumber: row.house_number,
                        moo: row.moo,
                        soi: row.soi,
                        road: row.road,
                        subDistrict: row.sub_district,
                        district: row.district,
                        province: row.province,
                        country: row.country,
                        postalCode: row.postal_code,
                        phoneNumber: row.phone_number,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    };
                    resolve(contactData);
                } catch (parseErr) {
                    console.error('Error parsing contact data:', parseErr);
                    reject(parseErr);
                }
            });
        });
    }

    async close(): Promise<void> {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err);
                    } else {
                        console.log('Database connection closed');
                    }
                    this.db = null;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

// Export a singleton instance
export const database = new Database();
