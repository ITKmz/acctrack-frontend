// <reference types="react-scripts" />

interface Window {
    process: {
      versions: {
        electron: string;
      };
    };
    electron: {
      saveFile: (jsonData: string) => void;
    };
  }