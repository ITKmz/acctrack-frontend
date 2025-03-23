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

// Save data to a file named by user ID
ipcMain.handle('save-file', async (event, { id, businessData }) => {
    const filePath = path.join(app.getPath('userData'), `${id}.json`);
    
    // Save business data in structured format
    fs.writeFileSync(filePath, JSON.stringify(businessData, null, 2));
});

// Read data from a file named by user ID
ipcMain.handle('read-file', async (event, id) => {
    const filePath = path.join(app.getPath('userData'), `${id}.json`);

    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    }

    return {};  // Return empty if file doesn't exist
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
