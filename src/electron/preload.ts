import { contextBridge, ipcRenderer } from 'electron';

// Define types for the data
interface BusinessData {
    businessType: string;
    registrationNumber: string;
    officeType: string;
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
}

// Expose methods to the renderer process
contextBridge.exposeInMainWorld('electron', {
    saveFile: (id: string, businessData: BusinessData) =>
        ipcRenderer.invoke('saveFile', { id, businessData }),
    readFile: (id: string) => ipcRenderer.invoke('readFile', id),
});
