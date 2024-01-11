const customContextMenu_el = document.getElementById('customContextMenu');
// Background Click Elements
const contextMenuBackground_el = document.getElementById('contextMenuBackground');
const contextBGAddFile_el = document.getElementById('contextBGAddFile');
const contextBGAddFolder_el = document.getElementById('contextBGAddFolder');

// Folder/File Click Elements
const contextMenuFileFolder_el = document.getElementById('contextMenuFileFolder');
const rcFileExplorer_el = document.getElementById('rcFileExplorer');

let rightClickedPath = '';
let rightClickItem = '';

function rightClickMenu(e, path){
    hideContextMenuContent();
    menuDisplay(e);
    rightClickedPath = path;

    switch (rightClickItem){
        case 'Background':
            contextMenuBackground_el.style.display = 'grid';
            break;
        case 'File':
            contextMenuFileFolder_el.style.display = 'grid';
            break;
        case 'Directory':
            contextMenuFileFolder_el.style.display = 'grid';
            break;
    }
}

function hideContextMenuContent() {
    const elementsToHide = [contextMenuBackground_el, contextMenuFileFolder_el];
    elementsToHide.forEach(element => {
        if (element.style.display === 'grid') {
            element.style.display = 'none';
        }
    });
}


function menuDisplay(e){
    e.preventDefault();

    customContextMenu_el.style.display = 'block';

    // Get the dimensions of the context menu
    const menuWidth = customContextMenu_el.offsetWidth;
    const menuHeight = customContextMenu_el.offsetHeight;

    // Get the dimensions of the window
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate the adjusted position to ensure the menu stays within the window
    const adjustedLeft = e.clientX + menuWidth > windowWidth ? windowWidth - menuWidth : e.clientX;
    const adjustedTop = e.clientY + menuHeight > windowHeight ? windowHeight - menuHeight : e.clientY;

    // Set the adjusted position
    customContextMenu_el.style.left = `${adjustedLeft}px`;
    customContextMenu_el.style.top = `${adjustedTop}px`;
}

document.addEventListener('click', () => {
    customContextMenu_el.style.display = 'none';
    rightClickedPath = '';
    hideContextMenuContent();
});

rcFileExplorer_el.addEventListener('click', () => {
    api.openFileBrowser({path: rightClickedPath});
});

contextBGAddFile_el.addEventListener('click', () => {
    addFileOverlay_el.style.display = 'flex';
});

contextBGAddFolder_el.addEventListener('click', () => {
    addFolderOverlay_el.style.display = 'flex';
});