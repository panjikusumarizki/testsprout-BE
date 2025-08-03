// minesweeper.js
const readline = require('readline');

class Minesweeper {
  constructor(size, numMines) {
    if (size <= 0 || numMines <= 0 || numMines >= size * size) {
      throw new Error('Invalid grid size or number of mines');
    }
    this.size = size;
    this.numMines = numMines;
    this.grid = Array.from({ length: size }, () => Array(size).fill('#'));
    this.mines = new Set();
    this.revealed = new Set();
    this.placeMines();
  }

  printGrid() {
    this.grid.forEach(row => console.log(row.join(' ')));
  }

  placeMines() {
    while (this.mines.size < this.numMines) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      this.mines.add(`${x},${y}`);
    }
  }

  countAdjacentMines(x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < this.size && ny < this.size) {
          if (this.mines.has(`${nx},${ny}`)) count++;
        }
      }
    }
    return count;
  }

  reveal(x, y) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
      throw new Error('Coordinates out of bounds');
    }
    const key = `${x},${y}`;
    if (this.revealed.has(key)) {
      throw new Error('Cell already revealed');
    }
    this.revealed.add(key);
    if (this.mines.has(key)) {
      this.grid[x][y] = '*';
      return false;
    } else {
      const count = this.countAdjacentMines(x, y);
      this.grid[x][y] = String(count);
      return true;
    }
  }

  isWon() {
    return this.revealed.size === this.size * this.size - this.numMines;
  }
}

function main(n) {
  const size = n;
  const numMines = n;
  const game = new Minesweeper(size, numMines);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function ask() {
    game.printGrid();
    rl.question('Enter row,col (e.g., 1,2): ', input => {
      const [xStr, yStr] = input.split(',');
      const x = parseInt(xStr) - 1;
      const y = parseInt(yStr) - 1;
      if (isNaN(x) || isNaN(y)) {
        console.log('Invalid input format. Use row,col');
        return ask();
      }
      try {
        const result = game.reveal(x, y);
        if (!result) {
          console.log('You hit a mine! Game Over.');
          game.printGrid();
          rl.close();
        } else if (game.isWon()) {
          console.log('Congratulations! You cleared the minefield.');
          game.printGrid();
          rl.close();
        } else {
          ask();
        }
      } catch (e) {
        console.log(e.message);
        ask();
      }
    });
  }

  ask();
}

if (require.main === module) {
  main(5);
}

module.exports = Minesweeper;
