const contextMenu = document.getElementById('customContextMenu');

const rcFileExplorer_el = document.getElementById('rcFileExplorer');

let rightClickedPath = '';

function rightClickMenu(e, path){
    menuDisplay(e);
    rightClickedPath = path;
}

function menuDisplay(e){
    e.preventDefault();

    contextMenu.style.display = 'block';

    // Get the dimensions of the context menu
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;

    // Get the dimensions of the window
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate the adjusted position to ensure the menu stays within the window
    const adjustedLeft = e.clientX + menuWidth > windowWidth ? windowWidth - menuWidth : e.clientX;
    const adjustedTop = e.clientY + menuHeight > windowHeight ? windowHeight - menuHeight : e.clientY;

    // Set the adjusted position
    contextMenu.style.left = `${adjustedLeft}px`;
    contextMenu.style.top = `${adjustedTop}px`;
}

document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
    rightClickedPath = '';
});

rcFileExplorer_el.addEventListener('click', () => {
    console.log(rightClickedPath);
    api.openFileBrowser({path: rightClickedPath});
});
