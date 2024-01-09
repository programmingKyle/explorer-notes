const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');

const util = require('util');
const readdir = util.promisify(fs.readdir);

const acceptedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.xml', '.md'];

const baseFileLocation = './src/baseFiles';
const stored = './src/stored.txt';

ipcMain.handle('open-file-dialog', async () => {
  let isSaveSuccessful = false; // Initialize isSaveSuccessful

  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
      ],
      title: 'Select a file',
    });

    const selectedPaths = result.filePaths;

    // Check if selectedPaths is not empty before attempting to save
    if (selectedPaths.length > 0) {
      isSaveSuccessful = await saveSelected(selectedPaths);
    }

    return isSaveSuccessful;
  } catch (err) {
    console.error('Error opening file dialog:', err);
    return isSaveSuccessful;
  }
});

ipcMain.handle('open-directory-dialog', async () => {
  let isSaveSuccessful = false;

  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections'],
      title: 'Select a folder',
    });

    const selectedPaths = result.filePaths;

    if (selectedPaths.length > 0) {
      isSaveSuccessful = await saveSelected(selectedPaths);
    }

    return isSaveSuccessful;
  } catch (err) {
    console.error('Error opening directory dialog:', err);
    return isSaveSuccessful;
  }
});

async function saveSelected(paths){
  const alreadySavedContent = await fs.promises.readFile(stored, 'utf-8');
  const savedLines = alreadySavedContent.split('\n').filter((line) => line.trim() !== '');

  let saveFailed = false;

  paths.forEach(path => {
    if (!savedLines.includes(path)){
      savedLines.push(path);
    } else {
      saveFailed = true;
    }
  });

  const newContent = savedLines.join('\n');
  fs.writeFileSync(stored, newContent + '\n', 'utf-8');

  if (saveFailed){
    return 'Failed'; //presumed that a fail is only the result of the file or folder already existing 
  }
}

ipcMain.handle('get-stored-content', async () => {
  const alreadySavedContent = await fs.promises.readFile(stored, 'utf-8');
  const savedLines = alreadySavedContent.split('\n').filter((line) => line.trim() !== '');

  const baseFileResults = await getBaseFiles();
  baseFileResults.forEach(element => {
    savedLines.push(element);    
  });
  return savedLines;
});

async function getBaseFiles(){
  try {
    const files = await readdir(baseFileLocation);
    const returnContent = [];

    for (const file of files) {
      const fileExt = path.extname(file).toLowerCase();
      if (fileExt === '') {
        if (fs.statSync(path.join(baseFileLocation, file)).isDirectory()) {
          const folderDirectory = path.join(baseFileLocation, file);
          returnContent.push(folderDirectory);
        }
      } else {
        const fileDirectory = path.join(baseFileLocation, file);
        returnContent.push(fileDirectory);
      }
    }
    return returnContent;
  } catch (err) {
    console.error('Error reading folder contents:', err);
    return [];
  }
}

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


ipcMain.handle('create-file', async (req, data) => {
  if (!data || !data.fileName) return;

  const createFile = async (filePath, iteration = 0) => {
    const ext = path.extname(filePath);
    const baseFileName = path.basename(filePath, ext);
    const currentFileName = iteration === 0 ? baseFileName : `${baseFileName}${iteration}`;
    const currentFilePath = path.join(path.dirname(filePath), `${currentFileName}${ext}`);

    try {
      await fs.access(currentFilePath, fs.constants.F_OK);
      // File already exists, try with a different iteration
      await createFile(filePath, iteration + 1);
    } catch (err) {
      // File does not exist, create it
      try {
        await fs.writeFile(currentFilePath, '', 'utf-8');
        // Handle success, send a response, etc.
      } catch (writeErr) {
        console.error('Error creating file:', writeErr);
      }
    }
  };

  try {
    if (data.location === '') {
      const filePath = path.join(baseFileLocation, addExtension(data.fileName));
      await createFile(filePath);
    } else {
      const filePathInDirectory = path.join(data.location, addExtension(data.fileName));
      await createFile(filePathInDirectory);
    }
  } catch (err) {
    console.error('Error creating file:', err);
  }
});

function addExtension(fileName) {
  const ext = path.extname(fileName);
  return ext !== '' ? fileName : fileName + '.txt';
}



ipcMain.handle('create-folder', (req, data) => {
  if (!data || !data.folderName) return;

  const createFolder = (folderPath, suffix = 0) => {
    const currentFolderPath = suffix === 0 ? folderPath : `${folderPath}${suffix}`;

    if (fs.existsSync(currentFolderPath)) {
      // Folder already exists, try with a different suffix
      createFolder(folderPath, suffix + 1);
    } else {
      // Folder does not exist, create it
      fs.mkdir(currentFolderPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating folder:', err);
          // Handle error, send a response, etc.
        } else {
          // Handle success, send a response, etc.
        }
      });
    }
  };
  if (data.location === '') {
    // Provide a valid folder path, for example, appending a folder name to the baseFileLocation
    const folderPath = path.join(baseFileLocation, data.folderName);
    createFolder(folderPath);
  } else {
    const folderPathInDirectory = path.join(data.location, data.folderName);
    createFolder(folderPathInDirectory);
  }
});


ipcMain.handle('is-file-or-directory', (req, data) => {
  if (!data || !data.path) return;
  try {
    const stats = fs.statSync(data.path);
    return stats.isFile() ? 'File' : stats.isDirectory() ? 'Directory' : 'Unknown';
  } catch (error) {
    // File doesn't exist
    return 'Error';
  }
});


ipcMain.handle('text-file-handler', (req, data) => {
  if (!data || !data.request || !data.path) return;
  switch(data.request) {
    case 'Read':
      const content = readTextFile(data.path);
      return content;
    case 'Write':
      writeTextFile(data.path, data.content);
      break;
  }
});

function readTextFile(path) {
  try {
    // Read the contents of the text file synchronously
    const fileContent = fs.readFileSync(path, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error(`Error reading file at ${path}: ${error.message}`);
    return null;
  }
}

function writeTextFile(path, content){
  try {
    fs.writeFileSync(path, content, 'utf-8');
  } catch (error) {
    console.error(`Error writing file at ${path}: ${error.message}`);
    return null;
  }
}

ipcMain.handle('drop-save-handler', async (req, data) => {
  if (!data || !data.paths) return;
  const result = await saveSelected(data.paths);
  if (result === 'Failed'){
    // A file being saved already exists
    return 'Failed';
  } else {
    return 'Success';
  }
});


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 325,
    minHeight: 500,
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

  const baseFolder = './src/baseFiles';
  try {
    await fs.ensureDir(baseFolder);
  } catch (err) {
    console.error('Error ensuring directory:', err);
  }
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
