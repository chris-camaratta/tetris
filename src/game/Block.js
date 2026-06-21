let nextId = 1;

export default class Block {
  constructor(color, pieceId = 0) {
    this.id = nextId++;
    this.color = color;
    this.pieceId = pieceId;
    this.isActive = true;
  }
  getColor() { return this.color; }
  setActive(flag) { this.isActive = flag; }
  getId() { return this.id; }
}
