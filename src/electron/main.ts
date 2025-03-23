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

ipcMain.handle('save-file', async (event, jsonData: string) => {
    const result = await dialog.showSaveDialog({
        title: 'Save File',
        defaultPath: 'form-data.json',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, jsonData);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
