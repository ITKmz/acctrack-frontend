import { app, BrowserWindow } from "electron";
import path from "path";

app.on("ready", () => {
    const win = new BrowserWindow({});
    win.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    });