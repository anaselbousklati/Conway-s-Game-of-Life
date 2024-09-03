const SIZE = 50;
const EMPTY = 0;
const ALIVE = 1;
let cells = [];
let htmlElements = [];
let intervalId = null;
let isRunning = false;
let speed = 100;

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
      tr.appendChild(td);
      htmlElements[y].push(td);
    }
  }
}

function draw() {
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
      if (cell === EMPTY && neighbors === 3) return ALIVE;
      if (cell === ALIVE && (neighbors === 2 || neighbors === 3)) return ALIVE;
      return EMPTY;
    })
  );

  cells = newCells;
  draw();
}

function init() {
  createField();
  populateRandomCells();
  draw();
}

function populateRandomCells() {
  const cellCount = Math.floor(SIZE * SIZE * 0.3);

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
  init();
}

function toggleCell(x, y) {
  cells[y][x] = cells[y][x] === ALIVE ? EMPTY : ALIVE;
  draw();
}

function updateSpeed() {
  const sliderValue = document.getElementById('speedSlider').value;
  speed = 1010 - sliderValue;
  if (isRunning) {
    pauseGame();
    startGame();
  }
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('speedSlider').addEventListener('input', updateSpeed);

init();
