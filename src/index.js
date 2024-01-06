const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const util = require('util');
const readdir = util.promisify(fs.readdir);

const acceptedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.xml', '.md'];


const stored = './src/stored.txt';

ipcMain.handle('open-file-dialog', async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
      ],
      title: 'Select a file',
    });

    const selectedPaths = result.filePaths;
    saveSelected(selectedPaths);
  } catch (err) {
    console.error('Error opening file dialog:', err);
  }
});

ipcMain.handle('open-directory-dialog', async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections'],
      title: 'Select a folder',
    });

    const selectedPaths = result.filePaths;
    saveSelected(selectedPaths);
  } catch (err) {
    console.error('Error opening directory dialog:', err);
  }
});

async function saveSelected(paths){
  const alreadySavedContent = await fs.promises.readFile(stored, 'utf-8');
  const savedLines = alreadySavedContent.split('\n').filter((line) => line.trim() !== '');

  paths.forEach(path => {
    if (!savedLines.includes(path)){
      savedLines.push(path);
    } else {
      console.log("Its here already");
    }
  });

  const newContent = savedLines.join('\n');
  fs.writeFileSync(stored, newContent + '\n', 'utf-8');
}



ipcMain.handle('get-stored-content', async () => {
  const alreadySavedContent = await fs.promises.readFile(stored, 'utf-8');
  const savedLines = alreadySavedContent.split('\n').filter((line) => line.trim() !== '');
  return savedLines;
});


ipcMain.handle('get-current-folder-contents', async (event, data) => {
  if (!data || !data.folderLocation) return;

  const folderLocation = data.folderLocation;

  try {
    const files = await readdir(folderLocation);
    const returnContent = [];

    for (const file of files) {
      const fileExt = path.extname(file).toLowerCase();
      if (fileExt === '') {
        if (fs.statSync(path.join(folderLocation, file)).isDirectory()) {
          const folderDirectory = path.join(folderLocation, file);
          returnContent.push(folderDirectory);
        }
      } else {
        const fileDirectory = path.join(folderLocation, file);
        returnContent.push(fileDirectory);
      }
    }
    return returnContent;
  } catch (err) {
    console.error('Error reading folder contents:', err);
    return [];
  }
});









// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {

  fs.access(stored, (err) => {
    if (err) {
      // File doesn't exist, create it
      fs.writeFile(stored, '', 'utf-8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
        }
      });
    }

    createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
