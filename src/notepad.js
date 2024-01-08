const fileNameHeader_el = document.getElementById('fileNameHeader');
const textFileTextArea_el = document.getElementById('textFileTextArea');
const saveTextFile_el = document.getElementById('saveTextFile');
const backButton_el = document.getElementById('backButton');
const toggleTextWrappingButton_el = document.getElementById('toggleTextWrappingButton');

let path = '';
let locationName
let directoryLocation = [];

let changeMade = false;

document.addEventListener('DOMContentLoaded', () => {
    initialPopulation();
});

textFileTextArea_el.addEventListener('input', () => {
    if (!changeMade){
        toggleSaveButton();
    }
});

function toggleSaveButton() {
    changeMade = !changeMade; // Toggle the changeMade flag
    saveTextFile_el.style.visibility = changeMade ? 'visible' : 'hidden';
}

function initialPopulation() {
    const urlParams = new URLSearchParams(window.location.search);
    path = urlParams.get('path');
    locationName = urlParams.get('locationName');
    
    console.log(path);
    console.log(locationName);
    
    fileNameHeader_el.textContent = locationName;

    const getDirectoryLocation = urlParams.get('directoryLocation');
    const directorySplit = getDirectoryLocation.split(',');
    directorySplit.forEach(element => {
        directoryLocation.push(element);
    });
    textFilePopulation(path);
}


async function textFilePopulation(path){
    const results = await api.textFileHandler({request: 'Read', path: path});
    textFileTextArea_el.value = results;
}

saveTextFile_el.addEventListener('click', async () => {
    await api.textFileHandler({request: 'Write', path: path, content: textFileTextArea_el.value});
    toggleSaveButton();
});

backButton_el.addEventListener('click', () => {
    directoryLocation.pop();
    const parentDirectory = getParentDirectory(path);
    const directoryLocationString = encodeURIComponent(JSON.stringify(directoryLocation));
    window.location.href = `index.html?path=${encodeURIComponent(parentDirectory)}&directoryLocation=${directoryLocationString}`;
});

function getParentDirectory(path) {
    const parts = path.split('\\');
    parts.pop(); 
    return parts.join('/');
}


let isWrappingActive = true;

toggleTextWrappingButton_el.addEventListener('click', () => {
    isWrappingActive = !isWrappingActive; // Toggle the button state

    // Add or remove the "active" class based on the button state
    if (isWrappingActive) {
        toggleTextWrappingButton_el.classList.add('active');
        textFileTextArea_el.classList.add('wrapping')
    } else {
        toggleTextWrappingButton_el.classList.remove('active');
        textFileTextArea_el.classList.remove('wrapping')
    }
});

textFileTextArea_el.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();

        const spacesForIndentation = '    ';
        const selectionStart = textFileTextArea_el.selectionStart;
        const selectionEnd = textFileTextArea_el.selectionEnd;

        // Insert the spaces or tabs at the current caret position
        textFileTextArea_el.value = 
            textFileTextArea_el.value.substring(0, selectionStart) +
            spacesForIndentation +
            textFileTextArea_el.value.substring(selectionEnd);

        // Move the caret to the end of the inserted spaces or tabs
        textFileTextArea_el.selectionStart = textFileTextArea_el.selectionEnd = selectionStart + spacesForIndentation.length;
    }
});

document.addEventListener('keydown', async (event) => {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        await api.textFileHandler({request: 'Write', path: path, content: textFileTextArea_el.value});
        toggleSaveButton();
    }
});

