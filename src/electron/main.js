import { app, BrowserWindow } from 'electron';
import path from 'path';

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 1280, // Default width
        height: 720, // Default height
        show: false, // Prevents flickering on startup
        webPreferences: {
            nodeIntegration: true,
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
