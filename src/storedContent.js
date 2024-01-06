const addFileButton_el = document.getElementById('addFileButton');
const addFolderButton_el = document.getElementById('addFolderButton');
const contentContainer_el = document.getElementById('contentContainer');
const locationHeader_el = document.getElementById('locationHeader');
const searchForContentDiv_el = document.getElementById('searchForContentDiv');
//const acceptedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.xml', '.md'];

const directoryLocation = [];
let currentDirectoryLocation = '';

document.addEventListener('DOMContentLoaded', async () => {
    const data = await api.getStoredContent();
    await populateStoredContent(data);
});

addFileButton_el.addEventListener('click', async () => {
    api.openFileDialog();
});

addFolderButton_el.addEventListener('click', async () => {
    api.openDirectoryDialog();
});

async function populateStoredContent(contents){
    if (contentContainer_el.innerHTML !== ''){
        contentContainer_el.innerHTML = '';
    }
    if (directoryLocation.length > 0){
        searchForContentDiv_el.style.visibility = 'hidden';
        populateBackButtonFolder();
    } else {
        searchForContentDiv_el.style.visibility = 'visible';
        currentDirectoryLocation = '';
    }
    for (const content of contents){
        const filePathArray = content.split('\\');
        const fileName = filePathArray[filePathArray.length -1];

        const icon = isFileOrFolder(fileName);
        

        const itemContainer_el = document.createElement('div');
        itemContainer_el.classList = 'button-container';
    
        const itemIcon_el = document.createElement('i');
        itemIcon_el.classList = icon;
    
        const itemHeader_el = document.createElement('h6');
        itemHeader_el.classList = 'file-content-header';
        itemHeader_el.textContent = fileName;
    
    
        itemContainer_el.append(itemIcon_el);
        itemContainer_el.append(itemHeader_el);
    
        contentContainer_el.append(itemContainer_el);
        await folderClick(itemContainer_el, content, fileName);
    }
}

async function folderClick(itemContainer, path, fileDirectory){
    itemContainer.addEventListener('click', async () => {
        directoryLocation.push(fileDirectory);
        currentDirectoryLocation = path;
        const result = await api.getCurrentFolderContents({folderLocation: path})
        await populateStoredContent(result);
    })
}


function populateBackButtonFolder(){
    const itemContainer_el = document.createElement('div');
    itemContainer_el.classList = 'button-container';

    const itemIcon_el = document.createElement('i');
    itemIcon_el.classList = 'fas fa-arrow-left';

    const itemHeader_el = document.createElement('h6');
    itemHeader_el.classList = 'file-content-header';
    itemHeader_el.textContent = 'Back';
    
    itemContainer_el.append(itemIcon_el);
    itemContainer_el.append(itemHeader_el);

    contentContainer_el.append(itemContainer_el);
    backButtonClick(itemContainer_el);
}

function backButtonClick(container) {
    container.addEventListener('click', async () => {
        directoryLocation.pop();

        if (directoryLocation.length < 1) {
            const data = await api.getStoredContent();
            populateStoredContent(data);
        } else {
            try {
                const directory = backDirectory(currentDirectoryLocation);
                
                const result = await api.getCurrentFolderContents({folderLocation: directory});
                await populateStoredContent(result);
            } catch (error) {
                console.error(error);
            }
        }
    });
}

function backDirectory(fileLocation){
    const directorySplit = fileLocation.split('\\');
    const directory = directorySplit.slice(0, -1).join('\\');
    currentDirectoryLocation = directory;
    return directory
}





function isFileOrFolder(file) {
    if (file.includes('.')) {
        const fileExtSplit = file.split('.');
        const fileExt = fileExtSplit[fileExtSplit.length - 1];
        return 'fas fa-file';
    } else {
        return 'fas fa-folder';
    }
}
