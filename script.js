const SIZE = 50;
const EMPTY = 0;
const ALIVE = 1;
const DEFAULT_SPEED = 100;
const INITIAL_LIVE_CELL_PERCENTAGE = 0.3;
const MAX_GRAPH_LENGTH = 100;

let cells = [];
let htmlElements = [];
let intervalId = null;
let isRunning = false;
let isMouseDown = false;
let speed = DEFAULT_SPEED;
let birthRule = [3];
let surviveRule = [2, 3];
let liveCellsData = [];
let chart = null;
let savedPatterns = {};

window.onload = () => {
  loadPatternsFromLocalStorage();
  initGame();
};

function initGame() {
  createField();
  populateRandomCells();
  drawField();
  initializeGraph();
}

function createField() {
  const table = document.getElementById('field');
  table.innerHTML = '';
  cells = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  htmlElements = cells.map(() => []);

  for (let y = 0; y < SIZE; y++) {
    const tr = document.createElement('tr');
    table.appendChild(tr);

    for (let x = 0; x < SIZE; x++) {
      const td = document.createElement('td');
      td.className = 'cell empty';

      td.addEventListener('click', () => toggleCell(x, y));

      td.addEventListener('mousedown', () => {
        isMouseDown = true;
        toggleCell(x, y);
      });

      td.addEventListener('mouseover', () => {
        if (isMouseDown) {
          toggleCell(x, y);
        }
      });

      document.addEventListener('mouseup', () => {
        isMouseDown = false;
      });

      tr.appendChild(td);
      htmlElements[y].push(td);
    }
  }
}

function drawField() {
  cells.forEach((row, y) => {
    row.forEach((cell, x) => {
      htmlElements[y][x].className = `cell ${cell === ALIVE ? 'filled' : 'empty'}`;
    });
  });
}

function countNeighbors(x, y) {
  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx !== 0 || dy !== 0) {
        const nx = (x + dx + SIZE) % SIZE;
        const ny = (y + dy + SIZE) % SIZE;
        count += cells[ny][nx];
      }
    }
  }

  return count;
}

function newGeneration() {
  const newCells = cells.map((row, y) =>
    row.map((cell, x) => {
      const neighbors = countNeighbors(x, y);
      if (cell === EMPTY && birthRule.includes(neighbors)) return ALIVE;
      if (cell === ALIVE && surviveRule.includes(neighbors)) return ALIVE;
      return EMPTY;
    })
  );

  cells = newCells;
  drawField();
  updateLiveCellsGraph();
}

function populateRandomCells() {
  const cellCount = Math.floor(SIZE * SIZE * INITIAL_LIVE_CELL_PERCENTAGE);

  for (let i = 0; i < cellCount; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * SIZE);
      y = Math.floor(Math.random() * SIZE);
    } while (cells[y][x] !== EMPTY);

    cells[y][x] = ALIVE;
  }
}

function startGame() {
  if (!isRunning) {
    isRunning = true;
    intervalId = setInterval(newGeneration, speed);
  }
}

function pauseGame() {
  isRunning = false;
  clearInterval(intervalId);
}

function resetGame() {
  pauseGame();
  initGame();
}

function toggleCell(x, y) {
  cells[y][x] = cells[y][x] === ALIVE ? EMPTY : ALIVE;
  drawField();
}

function updateSpeed() {
  const sliderValue = document.getElementById('speedSlider').value;
  speed = 1010 - sliderValue;
  if (isRunning) {
    pauseGame();
    startGame();
  }
}

function updateRules() {
  birthRule = document.getElementById('birthRule').value.split(',').map(Number);
  surviveRule = document.getElementById('surviveRule').value.split(',').map(Number);
}

function initializeGraph() {
  const ctx = document.getElementById('liveCellsGraph').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Live Cells',
        data: [],
        borderColor: '#4CAF50',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Generaties' } },
        y: { title: { display: true, text: 'Levende Cellen' } }
      }
    }
  });
}

function updateLiveCellsGraph() {
  const liveCount = cells.flat().filter(cell => cell === ALIVE).length;
  liveCellsData.push(liveCount);
  if (liveCellsData.length > MAX_GRAPH_LENGTH) liveCellsData.shift();

  chart.data.labels = liveCellsData.map((_, i) => i + 1);
  chart.data.datasets[0].data = liveCellsData;
  chart.update();
}

function resetGraph() {
  liveCellsData = [];
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
}

function savePattern() {
  const patternName = prompt('Voer een patroonnaam in:');
  if (patternName) {
    savedPatterns[patternName] = {
      cells: JSON.parse(JSON.stringify(cells)),
      liveCellsData: [...liveCellsData]
    };
    updatePatternList();
    savePatternsToLocalStorage();
  }
}

function loadPattern() {
  const patternName = document.getElementById('patternList').value;
  if (patternName && savedPatterns[patternName]) {
    cells = JSON.parse(JSON.stringify(savedPatterns[patternName].cells));
    liveCellsData = [...savedPatterns[patternName].liveCellsData];
    drawField();
    resetGraph();
    updateLiveCellsGraph();
  }
}

function updatePatternList() {
  const patternList = document.getElementById('patternList');
  patternList.innerHTML = '';
  Object.keys(savedPatterns).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    patternList.appendChild(option);
  });

  patternList.addEventListener('change', loadPattern);
}

function savePatternsToLocalStorage() {
  localStorage.setItem('savedPatterns', JSON.stringify(savedPatterns));
}

function loadPatternsFromLocalStorage() {
  const storedPatterns = localStorage.getItem('savedPatterns');
  if (storedPatterns) {
    savedPatterns = JSON.parse(storedPatterns);
    updatePatternList();
  }
}

function managePatterns() {
  const patternName = document.getElementById('patternList').value;
  if (!patternName) return alert('Selecteer een patroon om te beheren.');

  const action = prompt(`Beheer patroon "${patternName}":\n1. Hernoemen\n2. Verwijderen`);
  if (action === '1') {
    const newName = prompt('Voer een nieuwe naam in:');
    if (newName && !savedPatterns[newName]) {
      savedPatterns[newName] = savedPatterns[patternName];
      delete savedPatterns[patternName];
      updatePatternList();
      savePatternsToLocalStorage();
    } else {
      alert('De nieuwe naam is ongeldig of al in gebruik.');
    }
  } else if (action === '2') {
    delete savedPatterns[patternName];
    updatePatternList();
    savePatternsToLocalStorage();
  }
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('speedSlider').addEventListener('input', updateSpeed);
document.getElementById('birthRule').addEventListener('input', updateRules);
document.getElementById('surviveRule').addEventListener('input', updateRules);
document.getElementById('savePatternBtn').addEventListener('click', savePattern);
document.getElementById('loadPatternBtn').addEventListener('click', loadPattern);
document.getElementById('managePatternsBtn').addEventListener('click', managePatterns);

initGame();