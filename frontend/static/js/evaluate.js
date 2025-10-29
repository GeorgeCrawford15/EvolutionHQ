function compareColumns() {
    const columnData = {};
    const speciesCount = document.querySelectorAll('th').length - 2;
    const speciesNames = [];
    let importingData = false;

    for (let col = 1; col <= speciesCount; col++) {
        const speciesElem = document.querySelector('.col' + col);
        let speciesName = '';

        if (speciesElem.children.length > 0 && speciesElem.children[0].tagName === 'INPUT') {
            speciesName = speciesElem.children[0].value.trim();
            console.log(speciesName);
        } else {
            importingData = true;
            speciesName = speciesElem.innerText.trim();
            console.log(speciesName);
        }

        speciesNames.push(speciesName);
        columnData[speciesName] = [];
    }

    function hasDuplicates(arr) {
        return new Set(arr).size !== arr.length;
    }

    const statusMessage = document.querySelector('.status-message');

    let binaries = [];
    let binaryArr = [];
    if (!importingData) {
        binaries = Array.from(document.querySelectorAll('.binary'));
        binaryArr = binaries.map(input => input.value.trim());
    } else {
        const dataRows = document.querySelectorAll('[class*="row"]');
        dataRows.forEach(row => {
            const rowBinaries = Array.from(row.children).slice(2);
            binaries.push(...rowBinaries);
        });
        binaryArr = binaries.map(el => el.innerText.trim());
    }

    const areNonBinaries = binaryArr.some(binary => binary !== "1" && binary !== "0" && binary !== "");
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

    binaries.forEach(binary => {
        if (!importingData) {
            if (binary.value === "") {
                binary.value = 0;
            }
        } else {
            if (binary.innerText === "") {
                binary.innerText = 0;
            }
        }
    });

    const rowCount = document.querySelectorAll('tr').length - 1;
    for (let col = 1; col <= speciesCount; col++) {
        for (let row = 1; row <= rowCount; row++) {

            let binary = '';
            if (!importingData) {
                binary = document.querySelector('.row' + row + ' td:nth-of-type(' + (col + 2) + ') .binary').value.trim();
            } else {
                binary = document.querySelector('.row' + row + ' td:nth-of-type(' + (col + 2) + ')').innerText.trim();
            }

            const speciesName = speciesNames[col - 1];
            columnData[speciesName].push(binary);
        }
    }

    const distanceMatrix = computeDistanceMatrix(columnData);
    console.log(distanceMatrix);

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

    const newick = upgma(distanceMatrix);
    renderTree(newick, referenceSpecies);
}

function computeDistanceMatrix(columnData) {
    const species = Object.keys(columnData);
    const distanceMatrix = {};

    for (let i = 0; i < species.length; i++) {
        distanceMatrix[species[i]] = {};
        for (let j = 0; j < species.length; j++) {
            if (i === j) {
                distanceMatrix[species[i]][species[j]] = 0;
            } else {
                let diff = 0;
                for (let k = 0; k < columnData[species[i]].length; k++) {
                    if (columnData[species[i]][k] !== columnData[species[j]][k]) diff++;
                }
                distanceMatrix[species[i]][species[j]] = diff;
            }
        }
    }

    return distanceMatrix;
}

// EVALUATE -- IMPORTANT
function upgma(distanceMatrix) {
  let clusters = Object.keys(distanceMatrix).map(name => ({
    name: name,
    size: 1,
    newick: name
  }));

  function getDistance(a, b) {
    return distanceMatrix[a][b];
  }

  while (clusters.length > 1) {
    let minDist = Infinity;
    let idxA = 0, idxB = 1;
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const d = getDistance(clusters[i].name, clusters[j].name);
        if (d < minDist) {
          minDist = d;
          idxA = i;
          idxB = j;
        }
      }
    }

    const clusterA = clusters[idxA];
    const clusterB = clusters[idxB];

    const branchLenA = (minDist / 2);
    const branchLenB = (minDist / 2);

    const newick =
      "(" + clusterA.newick + ":" + branchLenA + "," + clusterB.newick + ":" + branchLenB + ")";

    const newClusterName = clusterA.name + "_" + clusterB.name;
    const newCluster = {
      name: newClusterName,
      size: clusterA.size + clusterB.size,
      newick: newick
    };

    distanceMatrix[newClusterName] = {};
    for (let k = 0; k < clusters.length; k++) {
      if (k !== idxA && k !== idxB) {
        const other = clusters[k];
        const dA = getDistance(clusterA.name, other.name);
        const dB = getDistance(clusterB.name, other.name);
        const weightedAvg =
          (dA * clusterA.size + dB * clusterB.size) /
          (clusterA.size + clusterB.size);
        distanceMatrix[newClusterName][other.name] = weightedAvg;
        distanceMatrix[other.name][newClusterName] = weightedAvg;
      }
    }

    clusters.splice(Math.max(idxA, idxB), 1);
    clusters.splice(Math.min(idxA, idxB), 1);

    for (let key in distanceMatrix) {
      delete distanceMatrix[key][clusterA.name];
      delete distanceMatrix[key][clusterB.name];
    }
    delete distanceMatrix[clusterA.name];
    delete distanceMatrix[clusterB.name];

    clusters.push(newCluster);
  }

  return clusters[0].newick + ";";
}

function renderTree(newickStr, referenceSpecies) {
    document.querySelector('.tree-results p').style.display = 'none';
    document.querySelector('.tree-container').innerHTML = '';
    document.querySelector('.tree-results').style.display = 'flex';
    document.querySelector('.save-tree').style.visibility = 'visible';
    document.querySelector('.save-tree-wrapper').style.visibility = 'visible';

    function parseNewick(str) {
        str = str.replace(/;/g, '');
        let index = 0;

        function parseNode() {
            let node = {};
            if (str[index] === '(') {
                index++;
                node.children = [];
                while (str[index] !== ')' && index < str.length) {
                    node.children.push(parseNode());
                    if (str[index] === ',') index++;
                }
                index++; // skip ')'
            }

            let name = '';
            while (index < str.length && !['(', ')', ',', ':'].includes(str[index])) {
                name += str[index++];
            }
            if (name) node.name = name;

            if (str[index] === ':') {
                index++;
                while (index < str.length && /[0-9.]/.test(str[index])) index++;
            }

            return node;
        }

        return parseNode();
    }

    const treeData = parseNewick(newickStr);

    const width = 800, height = 600;
    const svg = d3.select('.tree-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const root = d3.hierarchy(treeData);

    const treeLayout = d3.tree().size([height - 100, width - 150]);
    treeLayout(root);

    const treeGroup = svg.append('g')
        .attr('transform', 'translate(50,50)');

    treeGroup.selectAll('line')
        .data(root.links())
        .enter()
        .append('line')
        .attr('x1', d => d.source.y)
        .attr('y1', d => d.source.x)
        .attr('x2', d => d.target.y)
        .attr('y2', d => d.target.x)
        .attr('stroke', 'black');

    treeGroup.selectAll('circle')
        .data(root.descendants())
        .enter()
        .append('circle')
        .attr('cx', d => d.y)
        .attr('cy', d => d.x)
        .attr('r', 4)
        .attr('fill', d => d.data.name === referenceSpecies ? 'green' : 'steelblue');

    treeGroup.selectAll('text')
        .data(root.descendants())
        .enter()
        .append('text')
        .attr('x', d => d.y + 6)
        .attr('y', d => d.x + 3)
        .text(d => d.data.name || '')
        .style('font-size', '12px')
        .style('fill', d => d.data.name === referenceSpecies ? 'green' : 'black');
}

function saveTree() {
    const svg = document.querySelector('.tree-container svg');
    saveSvgAsPng(svg, 'phylogenetic_tree.png');
}