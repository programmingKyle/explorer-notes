const addFileButton_el = document.getElementById('addFileButton');
const addFolderButton_el = document.getElementById('addFolderButton');
const contentContainer_el = document.getElementById('contentContainer');
const locationHeader_el = document.getElementById('locationHeader');
const searchForContentDiv_el = document.getElementById('searchForContentDiv');
//const acceptedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.xml', '.md'];

const directoryLocation = [];
let currentDirectoryLocation = '';

document.addEventListener('DOMContentLoaded', async () => {
    if (!returnFromNotepad()) {
        const data = await api.getStoredContent();
        await populateFolderContent(data);
    } else {
        const result = await api.getCurrentFolderContents({ folderLocation: currentDirectoryLocation });
        await populateFolderContent(result);
    }
});

function returnFromNotepad() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (!urlParams.has('path')) {
        return false;
    } else {
        currentDirectoryLocation = urlParams.get('path');

        // Check if directoryLocationString is not null or undefined
        const directoryLocationString = urlParams.get('directoryLocation');
        if (directoryLocationString) {
            const parsedDirectoryLocation = JSON.parse(decodeURIComponent(directoryLocationString));
            
            // Push elements into directoryLocation array
            parsedDirectoryLocation.forEach(element => {
                directoryLocation.push(element);
            });
        }
        return true;
    }
}

addFileButton_el.addEventListener('click', async () => {
    const result = await api.openFileDialog();
    if (result === true){
        const data = await api.getStoredContent();
        await populateFolderContent(data);
    } else {
        console.log('Error adding file!');
    }
});

addFolderButton_el.addEventListener('click', async () => {
    const result = await api.openDirectoryDialog();
    if (result === true){
        const data = await api.getStoredContent();
        await populateFolderContent(data);
    } else {
        console.log('Error adding file!');
    }
});

async function populateFolderContent(contents){
    if (contentContainer_el.innerHTML !== ''){
        contentContainer_el.innerHTML = '';
    }
    if (directoryLocation.length > 0){
        searchForContentDiv_el.style.display = 'none';
        populateBackButtonFolder();
    } else {
        searchForContentDiv_el.style.display = 'flex';
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
        await contentItemClick(itemContainer_el, content, fileName);
    }
}

async function contentItemClick(itemContainer, path, locationName){
    itemContainer.addEventListener('click', async () => {
        const result = await api.isFileOrDirectory({path: path});
        if (result === 'Directory') {
            folderClick(path, locationName)
        } else if (result === 'File') { 
            fileClick(path, locationName);
        }
    })
}

async function folderClick(path, locationName){
    directoryLocation.push(locationName);
    currentDirectoryLocation = path;
    locationHeader_el.textContent = locationName;
    const result = await api.getCurrentFolderContents({folderLocation: path})
    await populateFolderContent(result);
}

async function fileClick(path, locationName) {
    directoryLocation.push(locationName);
    currentDirectoryLocation = path;

    // Construct the URL parameters without using stringify or join
    let timerLocation = `notepad.html?path=${encodeURIComponent(path)}&locationName=${encodeURIComponent(locationName)}`;

    // Append the directoryLocation array to the URL
    if (directoryLocation.length > 0) {
        timerLocation += '&directoryLocation=';

        for (let i = 0; i < directoryLocation.length; i++) {
            if (i > 0) {
                timerLocation += ',';
            }
            timerLocation += encodeURIComponent(directoryLocation[i]);
        }
    }

    window.location.href = timerLocation;
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
            locationHeader_el.textContent = 'Overview';
            const data = await api.getStoredContent();
            await populateFolderContent(data);
        } else {
            try {
                const directory = backDirectory(currentDirectoryLocation);
                
                const result = await api.getCurrentFolderContents({folderLocation: directory});
                await populateFolderContent(result);
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
