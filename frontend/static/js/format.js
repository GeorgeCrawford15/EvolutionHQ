// Table formatting functions
let rowCount = 1;
function addRow() {
    rowCount++;
    document.querySelector('.status-message').style.visibility = 'hidden';
    const tableBody = document.querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.className = 'row' + rowCount;
    const newCharBox = document.createElement('td');
    const newCharInput = document.createElement('input');
    newCharInput.type = 'text';
    newCharInput.className = 'character';
    const newStateBox = document.createElement('td');
    const newStateInput = document.createElement('input');
    newStateInput.type = 'text';
    newStateInput.className = 'state';
    newCharBox.appendChild(newCharInput);
    newStateBox.appendChild(newStateInput);
    newRow.appendChild(newCharBox);
    newRow.appendChild(newStateBox);
    tableBody.appendChild(newRow);

    for (let i = 0; i < speciesCount; i++) {
        const newBinaryBox = document.createElement('td');
        const newBinary = document.createElement('input');
        newBinary.type = 'number';
        newBinary.className = 'binary';
        newBinary.min = '0';
        newBinary.max = '1';
        newBinaryBox.appendChild(newBinary);
        newRow.appendChild(newBinaryBox);
    }
}

function removeRow() {
    document.querySelector('.status-message').style.visibility = 'hidden';
    if (rowCount > 1) {
        bottomRow = document.querySelector('.row' + rowCount);
        bottomRow.remove();
        rowCount--;
    } else {
        document.querySelector('.status-message').style.visibility = 'visible';
        document.querySelector('.status-message').innerText = "Already at minimum number of rows.";
        document.querySelector('.status-message').style.color = 'red';
    }
}

let speciesCount = 5;
function addColumn() {
    document.querySelector('.status-message').style.visibility = 'hidden';
    if (speciesCount < 14) {
        speciesCount++;
        const topRow = document.getElementById('top-row');
        const newNameBox = document.createElement('th');
        newNameBox.className = 'col' + speciesCount;
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'species-name';
        newInput.placeholder = 'Species ' + speciesCount;
        newNameBox.appendChild(newInput);
        topRow.appendChild(newNameBox);

        for (let i = 1; i <= rowCount; i++) {
            const row = document.querySelector('.row' + i);
            const newBinaryBox = document.createElement('td');
            const newBinary = document.createElement('input');
            newBinary.type = 'number';
            newBinary.className = 'binary';
            newBinary.min = '0';
            newBinary.max = '1';
            newBinaryBox.appendChild(newBinary);
            row.appendChild(newBinaryBox);
        }
    } else {
        document.querySelector('.status-message').style.visibility = 'visible';
        document.querySelector('.status-message').innerText = "No more species can be added. Maximum number of species is 14.";
        document.querySelector('.status-message').style.color = 'red';
    }
}

function removeColumn() {
    document.querySelector('.status-message').style.visibility = 'hidden';
    if (speciesCount > 2) {
        const lastColumnHead = document.querySelector('.col' + speciesCount);
        lastColumnHead.remove();
        for (let i = 1; i <= rowCount; i++) {
            const lastBinary = document.querySelector('.row' + i + ' td:last-of-type');
            lastBinary.remove();
        }
        speciesCount--;
    } else {
        document.querySelector('.status-message').style.visibility = 'visible';
        document.querySelector('.status-message').innerText = "Already at minimum number of columns. You must have two to compare.";
        document.querySelector('.status-message').style.color = 'red';
    }
}


// Arrow keys functionality
document.addEventListener('keydown', (event) => {
    let inputs = Array.from(document.querySelectorAll('input'));
    inputs.shift();
    inputs.shift();
    inputs = inputs.filter(input => input.className !== 'species-name');

    const currentFocusedInput = document.activeElement;
    if (!inputs.includes(currentFocusedInput)) {
        return;
    }

    const numColumns = speciesCount + 2;

    const currentIndex = inputs.indexOf(currentFocusedInput);
    let targetIndex = -1;

    switch (event.key) {
        case 'ArrowUp':
            targetIndex = currentIndex - numColumns;
            break;
        case 'ArrowDown':
            targetIndex = currentIndex + numColumns;
            break;
        case 'ArrowLeft':
            if (currentIndex % numColumns !== 0) {
                targetIndex = currentIndex - 1;
            }
            break;
        case 'ArrowRight':
            if ((currentIndex + 1) % numColumns !== 0) {
                targetIndex = currentIndex + 1;
            }
            break; 
        case 'Enter':
            targetIndex = currentIndex + 1;
            break;
        default:
            return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    if (targetIndex >= 0 && targetIndex < inputs.length) {
        inputs[targetIndex].focus();
    } else if (event.key === 'Enter' && targetIndex >= inputs.length) {
        inputs[0].focus();
    }
});

document.getElementById('csv-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        complete: function(results) {
            populateMatrix(results.data);
        }
    });

    document.querySelector('.buttons').style.display = 'none';
});

function populateMatrix(data) {
    const desiredSpecies = data[0].length - 2;
    const desiredRows = data.length - 1;

    const topRow = document.getElementById('top-row');
    const tableBody = document.querySelector('tbody');
    console.log(topRow, tableBody);

    while (topRow.children.length > 2) {
        topRow.removeChild(topRow.lastElementChild);
    }

    /*if (tableBody.children.length > 0) {
        tableBody.removeChild(tableBody.lastElementChild);
    }*/

    while (tableBody.children.length > 0) {
        tableBody.removeChild(tableBody.lastElementChild);
    }

    rowCount = 0;
    speciesCount = 0;
    for (let i = 0; i < desiredSpecies; i++) addColumn();
    for (let i = 0; i < desiredRows; i++) addRow();

    const cols = Array.from(topRow.children);
    for (let i = 2; i < cols.length; i++) {
        cols[i].innerText = data[0][i];
    }

    const rows = Array.from(tableBody.children);
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < cols.length; j++) {
            rows[i].children[j].innerText = data[i + 1][j];
        }
    }
}