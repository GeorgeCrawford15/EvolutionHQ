const monoSection = document.querySelector('.mono-cross');
const diSection = document.querySelector('.di-cross');

function toggleDiCross() {
    monoSection.style.display = 'none';
    diSection.style.display = 'block';
}

function toggleMonoCross() {
    diSection.style.display = 'none';
    monoSection.style.display = 'block';
}


const monoButton = document.getElementById('mono-button');

const parent1GenoDescriptionMono = document.getElementById('parent1-geno-mono');
const parent2GenoDescriptionMono = document.getElementById('parent2-geno-mono');

const parent1Gamete1Mono = document.getElementById('parent1-gamete1-mono');
const parent1Gamete2Mono = document.getElementById('parent1-gamete2-mono');
const parent2Gamete1Mono = document.getElementById('parent2-gamete1-mono');
const parent2Gamete2Mono = document.getElementById('parent2-gamete2-mono');

const offspring1Mono = document.getElementById('offspring1-mono');
const offspring2Mono = document.getElementById('offspring2-mono');
const offspring3Mono = document.getElementById('offspring3-mono');
const offspring4Mono = document.getElementById('offspring4-mono');

const genotypicRatioMono = document.getElementById('geno-ratio-mono');
const phenotypicRatioMono = document.getElementById('pheno-ratio-mono');

const baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `${window.location.protocol}//${window.location.hostname}:5001`
  : 'https://evolutionhq.onrender.com';


monoButton.addEventListener('click', function() {
    const parent1Input = document.getElementById('parent1-input-mono').value;
    const parent2Input = document.getElementById('parent2-input-mono').value;

    parent1Gamete1Mono.innerText = parent1Input.charAt(0);
    parent1Gamete2Mono.innerText = parent1Input.charAt(1);
    parent2Gamete1Mono.innerText = parent2Input.charAt(0);
    parent2Gamete2Mono.innerText = parent2Input.charAt(1);

    document.getElementById('mono-caption').style.visibility = 'visible';
    parent1GenoDescriptionMono.innerText = parent1Input;
    parent2GenoDescriptionMono.innerText = parent2Input;

    fetch(`${baseUrl}/calculatemono`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            parent1: parent1Input,
            parent2: parent2Input
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data);

        offspring1Mono.innerText = data.offspring1;
        offspring2Mono.innerText = data.offspring2;
        offspring3Mono.innerText = data.offspring3;
        offspring4Mono.innerText = data.offspring4;

        const offspringArrMono = [offspring1Mono, offspring2Mono, offspring3Mono, offspring4Mono];
        const delay = 50;
        offspringArrMono.forEach((offspring, index) => {
            setTimeout(() => {
                offspring.classList.add('fade-in');
            }, delay * index);
        });

        genotypicRatioMono.innerText = data.geno_ratio;
        phenotypicRatioMono.innerText = data.pheno_ratio;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


const diButton = document.getElementById('di-button');

const parent1GenoDescriptionDi = document.getElementById('parent1-geno-di');
const parent2GenoDescriptionDi = document.getElementById('parent2-geno-di');

const parent1Gamete1Di = document.getElementById('parent1-gamete1-di');
const parent1Gamete2Di = document.getElementById('parent1-gamete2-di');
const parent1Gamete3Di = document.getElementById('parent1-gamete3-di');
const parent1Gamete4Di = document.getElementById('parent1-gamete4-di');
const parent2Gamete1Di = document.getElementById('parent2-gamete1-di');
const parent2Gamete2Di = document.getElementById('parent2-gamete2-di');
const parent2Gamete3Di = document.getElementById('parent2-gamete3-di');
const parent2Gamete4Di = document.getElementById('parent2-gamete4-di');

const genotypicRatioDi = document.getElementById('geno-ratio-di');
const phenotypicRatioDi = document.getElementById('pheno-ratio-di');

diButton.addEventListener('click', function() {
    const parent1Input = document.getElementById('parent1-input-di').value;
    const parent2Input = document.getElementById('parent2-input-di').value;

    parent1Gamete1Di.innerText = parent1Input.charAt(0) + parent1Input.charAt(2);
    parent1Gamete2Di.innerText = parent1Input.charAt(0) + parent1Input.charAt(3);
    parent1Gamete3Di.innerText = parent1Input.charAt(1) + parent1Input.charAt(2);
    parent1Gamete4Di.innerText = parent1Input.charAt(1) + parent1Input.charAt(3);
    parent2Gamete1Di.innerText = parent2Input.charAt(0) + parent2Input.charAt(2);
    parent2Gamete2Di.innerText = parent2Input.charAt(0) + parent2Input.charAt(3);
    parent2Gamete3Di.innerText = parent2Input.charAt(1) + parent2Input.charAt(2);
    parent2Gamete4Di.innerText = parent2Input.charAt(1) + parent2Input.charAt(3);

    document.getElementById('di-caption').style.visibility = 'visible';
    parent1GenoDescriptionDi.innerText = parent1Input;
    parent2GenoDescriptionDi.innerText = parent2Input;

    fetch(`${baseUrl}/calculatedi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            parent1: parent1Input,
            parent2: parent2Input
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data);

        const diPunnettCells = document.querySelectorAll('.di-punnett td');
        const delay = 50;
        data.offspring.forEach((offspring, index) => {
            setTimeout(() => {
                diPunnettCells[index].innerText = offspring;
                diPunnettCells[index].classList.add('fade-in');
            }, delay * index);
        });
        
        genotypicRatioDi.innerText = data.geno_ratio;
        phenotypicRatioDi.innerText = data.pheno_ratio;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});