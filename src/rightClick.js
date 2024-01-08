document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    const contextMenu = document.getElementById('customContextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
});

document.addEventListener('click', () => {
    const contextMenu = document.getElementById('customContextMenu');
    contextMenu.style.display = 'none';
});