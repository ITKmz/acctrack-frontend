import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.on('ready', () => {
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

const getUserFilePath = (userId: string) =>
    path.join(app.getPath('userData'), `${userId}_business.json`);

ipcMain.handle('saveFile', async (_event, userId: string, businessData) => {
    try {
        const filePath = getUserFilePath(userId);
        fs.writeFileSync(
            filePath,
            JSON.stringify(businessData, null, 2),
            'utf-8',
        );
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

ipcMain.handle('readFile', async (_event, userId: string) => {
    try {
        const filePath = getUserFilePath(userId);
        if (!fs.existsSync(filePath)) return {}; // No saved file yet
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        return { error: (err as Error).message };
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
