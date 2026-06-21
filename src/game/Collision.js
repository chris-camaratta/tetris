export default class Collision {
  static canMoveTo(piece, grid, newX, newY) {
    const geometry = piece.shapeGeometry;
    const height = geometry.length;
    const width = geometry[0].length;
    
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (geometry[row][col]) {
          const gridX = newX + col;
          const gridY = newY + row;
          if (gridX < 0 || gridX >= grid.width || gridY >= grid.height) return false;
          if (gridY >= 0 && grid.isCellOccupied(gridX, gridY)) return false;
        }
      }
    }
    return true;
  }
  static canRotate(piece, grid) {
    const rotated = this.rotateGeometry(piece.shapeGeometry, 'CW');
    const tempPiece = { ...piece, shapeGeometry: rotated };
    return this.canMoveTo(tempPiece, grid, piece.posX, piece.posY);
  }
  static canFlip(piece, grid) {
    const flipped = this.flipGeometry(piece.shapeGeometry);
    const tempPiece = { ...piece, shapeGeometry: flipped };
    return this.canMoveTo(tempPiece, grid, piece.posX, piece.posY);
  }
  static rotateGeometry(grid, direction) {
    const rows = grid.length;
    const cols = grid[0].length;
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (direction === 'CW') {
          rotated[col][rows - row - 1] = grid[row][col];
        } else {
          rotated[cols - col - 1][row] = grid[row][col];
        }
      }
    }
    return rotated;
  }
  static flipGeometry(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const flipped = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        flipped[row][cols - col - 1] = grid[row][col];
      }
    }
    return flipped;
  }
}
