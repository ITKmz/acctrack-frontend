// <reference types="react-scripts" />

interface Window {
    process: {
        versions: {
            electron: string;
        };
    };
    electron: {
        saveFile: (id: string, businessData: any) => void;
        readFile: (id: string) => Promise<any>;
    };
}
