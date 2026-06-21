export default class Cell {
  constructor() {
    this.occupied = null;
  }
  fill(block) { this.occupied = block; }
  empty() { this.occupied = null; }
  isOccupied() { return this.occupied !== null; }
}
