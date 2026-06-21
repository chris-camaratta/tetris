import Cell from './Cell.js';

export default class GameGrid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (let x = 0; x < width; x++) {
      this.cells[x] = [];
      for (let y = 0; y < height; y++) {
        this.cells[x][y] = new Cell();
      }
    }
  }
  getCell(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.cells[x][y];
  }
  isCellOccupied(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return true;
    return this.cells[x][y].isOccupied();
  }
  occupyCell(x, y, block) {
    const cell = this.getCell(x, y);
    if (cell) cell.fill(block);
  }
  clearCell(x, y) {
    const cell = this.getCell(x, y);
    if (cell) cell.empty();
  }
  getRow(y) {
    if (y < 0 || y >= this.height) return [];
    return this.cells.map(col => col[y]);
  }
  isRowFull(y) {
    if (y < 0 || y >= this.height) return false;
    return this.cells.every(col => col[y].isOccupied());
  }
  clearFullRows() {
    const writeRow = [];
    for (let y = 0; y < this.height; y++) {
      if (!this.isRowFull(y)) writeRow.push(y);
    }

    const rowsCleared = this.height - writeRow.length;
    if (rowsCleared === 0) return 0;

    let targetY = this.height - 1;
    for (let i = writeRow.length - 1; i >= 0; i--) {
      const sourceY = writeRow[i];
      for (let x = 0; x < this.width; x++) {
        const sourceCell = this.cells[x][sourceY];
        const targetCell = this.cells[x][targetY];
        if (sourceCell.isOccupied()) {
          targetCell.fill(sourceCell.occupied);
        } else {
          targetCell.empty();
        }
      }
      targetY--;
    }

    for (let y = targetY; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        this.cells[x][y].empty();
      }
    }

    return rowsCleared;
  }
  clearAllRows() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y].empty();
      }
    }
  }
}
