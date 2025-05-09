export {};

declare global {
    interface Window {
        electron: {
            saveFile: (
                userId: string,
                data: any,
            ) => Promise<{ success: boolean; error?: string }>;
            readFile: (userId: string) => Promise<any>;
        };
    }
}
