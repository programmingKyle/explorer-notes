const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openFileDialog: (data) => ipcRenderer.invoke('open-file-dialog', data),
    openDirectoryDialog: (data) => ipcRenderer.invoke('open-directory-dialog', data),

    getStoredContent: () => ipcRenderer.invoke('get-stored-content'),

    getCurrentFolderContents: (data) => ipcRenderer.invoke('get-current-folder-contents', data),

    createFile: (data) => ipcRenderer.invoke('create-file', data),
    createFolder: (data) => ipcRenderer.invoke('create-folder', data),
});