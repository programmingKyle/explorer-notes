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

// Edit Variables
const editOverlay_el = document.getElementById('editOverlay');
const editCloseButton_el = document.getElementById('editCloseButton');
const editInput_el = document.getElementById('editInput');
const confirmEditButton_el = document.getElementById('confirmEditButton');

// Delete Variables
const deleteOverlay_el = document.getElementById('deleteOverlay');
const deleteCloseButton_el = document.getElementById('deleteCloseButton');
const deleteInput_el = document.getElementById('deleteInput');
const confirmDeleteButton_el = document.getElementById('confirmDeleteButton');


addNewFileButton_el.addEventListener('click', () => {
    addFileOverlay_el.style.display = 'flex';
});

addFileCloseButton_el.addEventListener('click', () => {
    addFileOverlay_el.style.display = 'none';
    addFileInput_el.value = '';
});

confirmAddNewFileButton_el.addEventListener('click', async () => {
    if (addFileInput_el.value !== '') {
        await api.createFile({ location: currentDirectoryLocation, fileName: addFileInput_el.value });
        addFileOverlay_el.style.display = 'none';
        await repopulateContent();
        addFileInput_el.value = '';
    } else {
        addFileInput_el.classList.add('error');
    }
});

addNewFolderButton_el.addEventListener('click', () => {
    addFolderOverlay_el.style.display = 'flex';
});

addFolderCloseButton_el.addEventListener('click', () => {
    addFolderOverlay_el.style.display = 'none';
    addFolderInput_el.value = '';
});

confirmAddNewFolderButton_el.addEventListener('click', async () => {
    if (addFolderInput_el.value !== ''){
        await api.createFolder({location: currentDirectoryLocation, folderName: addFolderInput_el.value});
        addFolderOverlay_el.style.display = 'none';
        await repopulateContent();    
        addFolderInput_el.value = '';
    } else {
        addFolderInput_el.classList.add('error');
    }
});

async function repopulateContent(){
    if (directoryLocation.length < 1){
        const data = await api.getStoredContent();
        await populateFolderContent(data);
    } else {
        const result = await api.getCurrentFolderContents({folderLocation: currentDirectoryLocation});
        await populateFolderContent(result);
    }
}

// Change Check for error styles
addFileInput_el.addEventListener('focus', () => {
    if (addFileInput_el.classList.contains('error')) {
        addFileInput_el.classList.remove('error');
    }
});

addFolderInput_el.addEventListener('focus', () => {
    if (addFolderInput_el.classList.contains('error')) {
        addFolderInput_el.classList.remove('error');
    }
})



function fileManagerEdit(path, oldName) {
    confirmEditButton_el.addEventListener('click', async () => {
        editOverlay_el.style.display = 'none';
        const newName = editInput_el.value;
        if (newName !== oldName){
            await api.editName({path, newName});
        }
        await repopulateContent();
    });
} 

// Edit Buttons
editCloseButton_el.addEventListener('click', () => {
    editOverlay_el.style.display = 'none';
    editInput_el.value = '';
});



function fileManagerDelete(path){
    confirmDeleteButton_el.addEventListener('click', async () => {
        if (deleteInput_el.value === 'DELETE'){
            console.log(path);
            deleteInput_el.value = '';
            deleteOverlay_el.style.display = 'none';
            await api.deleteName({path});
            await repopulateContent();
        }
    });
}

deleteCloseButton_el.addEventListener('click', () => {
    deleteOverlay_el.style.display = 'none';
    deleteInput_el.value = '';
});

