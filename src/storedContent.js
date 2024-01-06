const addFileButton_el = document.getElementById('addFileButton');
const addFolderButton_el = document.getElementById('addFolderButton');
const contentContainer_el = document.getElementById('contentContainer');

//const acceptedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.xml', '.md'];


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
        await folderClick(itemContainer_el, content);
    }
}

async function folderClick(itemContainer, path){
    itemContainer.addEventListener('click', async () => {
        const result = await api.getCurrentFolderContents({folderLocation: path})
        await populateStoredContent(result);
    })
}


function populateBackButtonFolder(){
    const itemContainer_el = document.createElement('div');
    itemContainer_el.classList = 'button-container';

    const itemIcon_el = document.createElement('i');
    itemIcon_el.classList = 'fas fa-file';

    const itemHeader_el = document.createElement('h6');
    itemHeader_el.classList = 'file-content-header';
    itemHeader_el.textContent = '...';
    
    itemContainer_el.append(itemIcon_el);
    itemContainer_el.append(itemHeader_el);

    contentContainer_el.append(itemContainer_el);
    backButtonClick(itemContainer_el);
}

function backButtonClick(container){
    container.addEventListener('click', () => {
        console.log('Go back');
    })
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
