function compareColumns() {
    const columnData = {};
    const columnCount = document.getElementsByClassName('species-name').length;
    const speciesNames = [];

    for (let col = 1; col <= columnCount; col++) {
        const speciesName = document.querySelector('.col' + col + ' .species-name').value;
        speciesNames.push(speciesName);
        columnData[speciesName] = [];
    }

    function hasDuplicates(arr) {
        return new Set(arr).size !== arr.length;
    }

    const statusMessage = document.querySelector('.status-message');
    const binaries = document.querySelectorAll('.binary');
    const binaryArr = Array.from(binaries).map(input => input.value);
    const areEmptyBinaries = binaryArr.some(binary => binary === "");
    const areNonBinaries = binaryArr.some(binary => binary !== "1" && binary !== "0");
    const referenceSpecies = document.getElementById('reference').value;

    if (speciesNames.some(species => species === "")) {
        statusMessage.style.visibility = 'visible';
        statusMessage.innerText = "Please give names to all of the columns, or delete the columns you don't need.";
        statusMessage.style.color = 'red';
        return;
    } else if (hasDuplicates(speciesNames)) {
        statusMessage.style.visibility = 'visible';
        statusMessage.innerText = "Species names must be unique.";
        return;
    } else if (areEmptyBinaries) {
        statusMessage.style.visibility = 'visible';
        statusMessage.innerText = "One or more binary values are missing. Please enter all necessary binary values.";
        return;
    } else if (areNonBinaries) {
        statusMessage.style.visibility = 'visible';
        statusMessage.innerText = "Please enter only binary values.";
        return;
    } else if (!referenceSpecies) {
        statusMessage.style.visibility = 'visible';
        statusMessage.innerText = "Please provide a species to compare the others against.";
        return;
    } else if (!speciesNames.some(species => species === referenceSpecies)) {
        statusMessage.style.visibility = 'visible';
        statusMessage.innerText = "The reference species must be one of species names you entered.";
        return;
    } else {
        statusMessage.style.visibility = 'hidden';
    }

    const rowCount = document.querySelectorAll('tr').length - 1;
    for (let col = 1; col <= columnCount; col++) {
        for (let row = 1; row <= rowCount; row++) {
            const binary = document.querySelector('.row' + row + ' td:nth-of-type(' + (col + 2) + ') .binary').value;
            const speciesName = speciesNames[col - 1];
            columnData[speciesName].push(binary);
        }
    }

    const modifiedSpeciesNames = speciesNames.filter(name => name !== referenceSpecies);

    const selectedColumn = columnData[referenceSpecies];
    delete columnData[referenceSpecies];

    let columnDifferences = {};
    for (const name of modifiedSpeciesNames) {
        columnDifferences[name + "DiffCounter"] = 0;
    }

    document.querySelectorAll('.results-content li').forEach(li => li.remove());
    document.querySelector('.results-content p').innerText = "Number of differences between " + referenceSpecies + " and...";
    document.querySelector('.results-content').style.backgroundColor = '';

    for (const name of modifiedSpeciesNames) {
        for (let i = 0; i < columnData[name].length; i++) {
            if (selectedColumn[i] !== columnData[name][i]) {
                columnDifferences[name + "DiffCounter"]++;
            }
        }
        const speciesDiffCount = document.createElement('li');
        speciesDiffCount.innerText = name + ": " + columnDifferences[name + "DiffCounter"];
        document.querySelector('.results-content ul').appendChild(speciesDiffCount);
    }
}