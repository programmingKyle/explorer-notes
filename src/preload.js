const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openFileDialog: (data) => ipcRenderer.invoke('open-file-dialog', data),
    openDirectoryDialog: (data) => ipcRenderer.invoke('open-directory-dialog', data),

    getStoredContent: () => ipcRenderer.invoke('get-stored-content'),
});