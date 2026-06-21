import Block from './Block.js';
import Collision from './Collision.js';

let nextPieceId = 1;

export default class Piece {
  constructor(shape, gameGrid) {
    this.id = nextPieceId++;
    this.shapeId = shape.getId();
    this.shapeGeometry = shape.getGeometry();
    this.color = shape.getColor();
    this.gameGrid = gameGrid;
    this.posX = Math.floor((gameGrid.width - this.shapeGeometry[0].length) / 2);
    this.posY = 0;
    this.blocks = [];
    this._buildBlocks();
  }

  _buildBlocks() {
    this.blocks = [];
    const geometry = this.shapeGeometry;
    for (let row = 0; row < geometry.length; row++) {
      for (let col = 0; col < geometry[row].length; col++) {
        if (geometry[row][col]) {
          const block = new Block(this.color, this.id);
          this.blocks.push({ block, offsetX: col, offsetY: row });
        }
      }
    }
  }

  canMove(direction, grid) {
    let newX = this.posX;
    let newY = this.posY;
    if (direction === 'LEFT') newX--;
    else if (direction === 'RIGHT') newX++;
    else if (direction === 'DOWN') newY++;
    return Collision.canMoveTo(this, grid, newX, newY);
  }

  move(direction) {
    if (direction === 'LEFT') this.posX--;
    else if (direction === 'RIGHT') this.posX++;
    else if (direction === 'DOWN') this.posY++;
  }

  rotate(direction, grid) {
    const rotated = Collision.rotateGeometry(this.shapeGeometry, direction);
    const temp = { ...this, shapeGeometry: rotated };
    if (!Collision.canMoveTo(temp, grid, this.posX, this.posY)) return false;
    this.shapeGeometry = rotated;
    this._buildBlocks();
    return true;
  }

  flip(grid) {
    const flipped = Collision.flipGeometry(this.shapeGeometry);
    const temp = { ...this, shapeGeometry: flipped };
    if (!Collision.canMoveTo(temp, grid, this.posX, this.posY)) return false;
    this.shapeGeometry = flipped;
    this._buildBlocks();
    return true;
  }

  drop(grid) {
    while (this.canMove('DOWN', grid)) {
      this.posY++;
    }
  }

  getBlocks() {
    return this.blocks;
  }

  occupyGridCells(grid) {
    for (const { block, offsetX, offsetY } of this.blocks) {
      const gridX = this.posX + offsetX;
      const gridY = this.posY + offsetY;
      if (gridY >= 0) grid.occupyCell(gridX, gridY, block);
    }
    for (const { block } of this.blocks) {
      block.setActive(false);
    }
  }
}
