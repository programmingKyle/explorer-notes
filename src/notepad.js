const fileNameHeader_el = document.getElementById('fileNameHeader');
const textFileTextArea_el = document.getElementById('textFileTextArea');
const saveTextFile_el = document.getElementById('saveTextFile');
const backButton_el = document.getElementById('backButton');

let path = '';
let locationName
let directoryLocation = [];

document.addEventListener('DOMContentLoaded', () => {
    initialPopulation();
});

function initialPopulation() {
    const urlParams = new URLSearchParams(window.location.search);
    path = urlParams.get('path');
    locationName = urlParams.get('locationName');
    
    
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