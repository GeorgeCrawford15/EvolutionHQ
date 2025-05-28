// Add functionality to the buttons
// Make it so that there's a limit of species columns that can be added
function addRow() {

}

function removeRow() {

}

let speciesNum = 5;
function addColumn() {
    speciesNum++;
    if (speciesNum < 11) {
        const topRow = document.getElementById('top-row');
        const newNameBox = document.createElement('th');
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'species-name';
        newInput.placeholder = 'Species ' + speciesNum.toString();
        newNameBox.appendChild(newInput);
        topRow.appendChild(newNameBox);
    } else {
        document.querySelector('.status-message').style.visibility = 'visible';
        document.querySelector('.status-message').innerText = "No more species can be added. Maximum number of species is 10."
    }
}

function removeColumn() {

}