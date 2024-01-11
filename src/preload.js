const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    isFileOrDirectory: (data) => ipcRenderer.invoke('is-file-or-directory', data),

    openFileDialog: (data) => ipcRenderer.invoke('open-file-dialog', data),
    openDirectoryDialog: (data) => ipcRenderer.invoke('open-directory-dialog', data),

    getStoredContent: () => ipcRenderer.invoke('get-stored-content'),

    getCurrentFolderContents: (data) => ipcRenderer.invoke('get-current-folder-contents', data),

    createFile: (data) => ipcRenderer.invoke('create-file', data),
    createFolder: (data) => ipcRenderer.invoke('create-folder', data),

    textFileHandler: (data) => ipcRenderer.invoke('text-file-handler', data),

    dropSaveHandler: (data) => ipcRenderer.invoke('drop-save-handler', data),

    openFileBrowser: (data) => ipcRenderer.invoke('open-file-browser', data),

    editName: (data) => ipcRenderer.invoke('edit-name', data),
});