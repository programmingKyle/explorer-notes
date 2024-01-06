// This actually gives you controlls to add, remove, and edit files and folders.
const addNewFileButton_el = document.getElementById('addNewFileButton');
const addNewFolderButton_el = document.getElementById('addNewFolderButton');

const addFileOverlay_el = document.getElementById('addFileOverlay');
const addFileCloseButton_el = document.getElementById('addFileCloseButton');
const addFileInput_el = document.getElementById('addFileInput');
const confirmAddNewFileButton_el = document.getElementById('confirmAddNewFileButton');

const addFolderOverlay_el = document.getElementById('addFolderOverlay');
const addFolderCloseButton_el = document.getElementById('addFolderCloseButton');
const addFolderInput_el = document.getElementById('addFolderInput');
const confirmAddNewFolderButton_el = document.getElementById('confirmAddNewFolderButton');



addNewFileButton_el.addEventListener('click', () => {
    addFileOverlay_el.style.display = 'flex';
});

addFileCloseButton_el.addEventListener('click', () => {
    addFileOverlay_el.style.display = 'none';
});

confirmAddNewFileButton_el.addEventListener('click', async () => {
    await api.createFile({location: currentDirectoryLocation, fileName: addFileInput_el.value});
    addFileOverlay_el.style.display = 'none';
});





addNewFolderButton_el.addEventListener('click', () => {
    addFolderOverlay_el.style.display = 'flex';
});

addFolderCloseButton_el.addEventListener('click', () => {
    addFolderOverlay_el.style.display = 'none';
});

confirmAddNewFolderButton_el.addEventListener('click', async () => {
    await api.createFolder({location: currentDirectoryLocation, folderName: addFolderInput_el.value});
    addFolderOverlay_el.style.display = 'none';
});