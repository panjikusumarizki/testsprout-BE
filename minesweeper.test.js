const Minesweeper = require('./minesweeper');

describe('Minesweeper Initialization', () => {
  test('should throw error for invalid size or mines', () => {
    expect(() => new Minesweeper(0, 1)).toThrow();
    expect(() => new Minesweeper(3, 10)).toThrow();
    expect(() => new Minesweeper(3, -1)).toThrow();
  });

  test('should create correct number of mines', () => {
    const game = new Minesweeper(5, 5);
    expect(game.mines.size).toBe(5);
  });

  test('grid should initialize with correct size and values', () => {
    const game = new Minesweeper(4, 2);
    expect(game.grid.length).toBe(4);
    expect(game.grid[0].length).toBe(4);
    expect(game.grid.flat().every(cell => cell === '#')).toBe(true);
  });
});

describe('Minesweeper Gameplay', () => {
  let game;
  beforeEach(() => {
    game = new Minesweeper(3, 1);
    game.mines = new Set(['0,0']); // known mine for deterministic test
  });

  test('should reveal a safe cell with correct adjacent count', () => {
    const result = game.reveal(1, 1); // 0-based index
    expect(result).toBe(true);
    expect(game.grid[1][1]).toBe('1');
  });

  test('should hit a mine and lose', () => {
    const result = game.reveal(0, 0); // hit the mine
    expect(result).toBe(false);
    expect(game.grid[0][0]).toBe('*');
  });

  test('should throw error when out of bounds', () => {
    expect(() => game.reveal(-1, 0)).toThrow('Coordinates out of bounds');
    expect(() => game.reveal(3, 3)).toThrow('Coordinates out of bounds');
  });

  test('should throw error when revealing the same cell twice', () => {
    game.reveal(1, 1);
    expect(() => game.reveal(1, 1)).toThrow('Cell already revealed');
  });

  test('should win when all safe cells are revealed', () => {
    const safeCells = [
      [0, 1], [0, 2],
      [1, 0], [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2]
    ];
    safeCells.forEach(([x, y]) => game.reveal(x, y));
    expect(game.isWon()).toBe(true);
  });
});
