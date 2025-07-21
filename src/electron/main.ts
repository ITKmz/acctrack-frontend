import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { database } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.on('ready', async () => {
    // Initialize database
    try {
        await database.initialize();
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

// Quotation IPC Handlers
ipcMain.handle('saveQuotation', async (_event, quotationData) => {
    try {
        const result = await database.saveQuotation(quotationData);
        return result;
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

ipcMain.handle('getQuotations', async (_event) => {
    try {
        const quotations = await database.getQuotations();
        return { success: true, data: quotations };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

app.on('window-all-closed', async () => {
    await database.close();
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', async () => {
    await database.close();
});
