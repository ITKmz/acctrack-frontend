import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    saveFile: (jsonData: string) => ipcRenderer.invoke('save-file', jsonData),
});
