import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { database } from './database/db.js';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.on('ready', async () => {
    // Load storage settings first
    let customDatabasePath: string | undefined;
    try {
        const settingsPath = path.join(app.getPath('userData'), 'storage-settings.json');
        if (fs.existsSync(settingsPath)) {
            const data = await fs.promises.readFile(settingsPath, 'utf-8');
            const settings = JSON.parse(data);
            if (settings.storageType === 'sqlite' && settings.databasePath) {
                customDatabasePath = settings.databasePath;
            }
        }
    } catch (error) {
        console.error('Error loading storage settings:', error);
    }

    // Initialize database with custom path if specified
    try {
        if (customDatabasePath) {
            console.log('Using custom database path:', customDatabasePath);
            await database.changeDatabasePath(customDatabasePath);
        } else {
            await database.initialize();
        }
    } catch (error) {
        console.error('Failed to initialize database:', error);
        app.quit();
        return;
    }

    const win = new BrowserWindow({
        width: 1280, // Default width
        height: 720, // Default height
        show: false, // Prevents flickering on startup
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    win.maximize(); // ✅ Open in maximized window mode
    win.show(); // ✅ Show the window after maximizing

    // Add keyboard shortcuts for DevTools
    win.webContents.on('before-input-event', (event, input) => {
        // F12 or Ctrl+Shift+I to toggle DevTools
        if (input.key === 'F12' || 
            (input.control && input.shift && input.key === 'I')) {
            if (win.webContents.isDevToolsOpened()) {
                win.webContents.closeDevTools();
            } else {
                win.webContents.openDevTools();
            }
        }
    });

    Menu.setApplicationMenu(null); // Disable the default menu

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
    }
});

// Business Data IPC Handlers
ipcMain.handle('saveBusinessData', async (_event, businessData) => {
    try {
        const result = await database.saveBusinessData(businessData);
        return result;
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

ipcMain.handle('getBusinessData', async (_event) => {
    try {
        const businessData = await database.getBusinessData();
        return businessData || {};
    } catch (err) {
        return { error: (err as Error).message };
    }
});

// Product IPC Handlers
ipcMain.handle('saveProduct', async (_event, productData) => {
    try {
        const result = await database.saveProduct(productData);
        return result;
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

ipcMain.handle('getProducts', async (_event) => {
    try {
        const products = await database.getProducts();
        return { success: true, data: products };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

ipcMain.handle('updateProduct', async (_event, { id, data }) => {
    try {
        const result = await database.updateProduct(id, data);
        return result;
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

ipcMain.handle('deleteProduct', async (_event, id: string) => {
    try {
        const result = await database.deleteProduct(id);
        return result;
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

// Contact Address Data handlers
ipcMain.handle('saveContactData', async (_event, contactData) => {
    try {
        const result = await database.saveContactData(contactData);
        return { success: true, id: result };
    } catch (error) {
        console.error('Error saving contact data:', error);
        return { success: false, error: (error as Error).message };
    }
});

ipcMain.handle('getContactData', async (_event) => {
    try {
        const contactData = await database.getContactData();
        return { success: true, data: contactData };
    } catch (error) {
        console.error('Error getting contact data:', error);
        return { success: false, error: (error as Error).message };
    }
});

// Storage Settings IPC Handlers
ipcMain.handle('saveStorageSettings', async (_event, settings) => {
    try {
        const settingsPath = path.join(app.getPath('userData'), 'storage-settings.json');
        await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2));
        
        // If SQLite storage type and custom path is specified, update database path
        if (settings.storageType === 'sqlite' && settings.databasePath) {
            try {
                await database.changeDatabasePath(settings.databasePath);
                console.log('Database path changed to:', settings.databasePath);
            } catch (dbError) {
                console.error('Error changing database path:', dbError);
                return { success: false, error: 'Failed to change database path: ' + (dbError as Error).message };
            }
        }
        
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

ipcMain.handle('getStorageSettings', async (_event) => {
    try {
        const settingsPath = path.join(app.getPath('userData'), 'storage-settings.json');
        if (fs.existsSync(settingsPath)) {
            const data = await fs.promises.readFile(settingsPath, 'utf-8');
            return JSON.parse(data);
        }
        return null; // Return null if no settings file exists
    } catch (err) {
        console.error('Error loading storage settings:', err);
        return null;
    }
});

// Check if folder contains existing data
ipcMain.handle('checkFolderForExistingData', async (_event, folderPath) => {
    try {
        const dbPath = path.join(folderPath, 'acctrack.db');
        if (fs.existsSync(dbPath)) {
            // Check if database has any data
            return new Promise((resolve) => {
                const testDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
                    if (err) {
                        resolve({ hasData: false, error: err.message });
                        return;
                    }
                    
                    // Check if there are any tables with data
                    testDb.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", (err, row: any) => {
                        if (err) {
                            resolve({ hasData: false, error: err.message });
                        } else {
                            const hasData = row && row.count > 0;
                            resolve({ hasData, tableCount: row?.count || 0 });
                        }
                        testDb.close();
                    });
                });
            });
        }
        return { hasData: false };
    } catch (err) {
        return { hasData: false, error: (err as Error).message };
    }
});

// Dialog IPC Handlers
ipcMain.handle('showMessageBox', async (_event, options) => {
    try {
        const result = await dialog.showMessageBox(options);
        return result;
    } catch (err) {
        return { response: -1, error: (err as Error).message };
    }
});

ipcMain.handle('showOpenDialog', async (_event, options) => {
    try {
        const result = await dialog.showOpenDialog(options);
        return result;
    } catch (err) {
        return { canceled: true, filePaths: [], error: (err as Error).message };
    }
});

// Recent folders handlers
ipcMain.handle('getRecentFolders', async (_event) => {
    try {
        const recentFoldersPath = path.join(app.getPath('userData'), 'recent-folders.json');
        if (fs.existsSync(recentFoldersPath)) {
            const data = await fs.promises.readFile(recentFoldersPath, 'utf-8');
            return JSON.parse(data) || [];
        }
        return [];
    } catch (error) {
        console.error('Error loading recent folders:', error);
        return [];
    }
});

ipcMain.handle('addToRecentFolders', async (_event, folderPath: string) => {
    try {
        const recentFoldersPath = path.join(app.getPath('userData'), 'recent-folders.json');
        let recentFolders: string[] = [];
        
        // Load existing recent folders
        if (fs.existsSync(recentFoldersPath)) {
            const data = await fs.promises.readFile(recentFoldersPath, 'utf-8');
            recentFolders = JSON.parse(data) || [];
        }
        
        // Remove if already exists and add to the beginning
        recentFolders = recentFolders.filter(folder => folder !== folderPath);
        recentFolders.unshift(folderPath);
        
        // Keep only the last 10 folders
        recentFolders = recentFolders.slice(0, 10);
        
        // Save updated list
        await fs.promises.writeFile(recentFoldersPath, JSON.stringify(recentFolders, null, 2));
    } catch (error) {
        console.error('Error saving recent folders:', error);
    }
});

app.on('window-all-closed', async () => {
    await database.close();
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', async () => {
    await database.close();
});
