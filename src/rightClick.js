function rightClickMenu(e){
    e.preventDefault();

    const contextMenu = document.getElementById('customContextMenu');
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
    const contextMenu = document.getElementById('customContextMenu');
    contextMenu.style.display = 'none';
});
