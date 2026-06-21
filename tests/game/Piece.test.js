import { describe, it, expect } from 'vitest';
import Piece from '../../src/game/Piece.js';
import GameGrid from '../../src/game/GameGrid.js';
import ShapeType from '../../src/game/ShapeType.js';

describe('Piece', () => {
  it('should create piece from shape', () => {
    const grid = new GameGrid(10, 20);
    const shape = ShapeType.CUBE();
    const piece = new Piece(shape, grid);
    expect(piece.color).toBe('yellow');
    expect(piece.blocks.length).toBe(4);
  });

  it('should position at top center', () => {
    const grid = new GameGrid(10, 20);
    const shape = ShapeType.LINE();
    const piece = new Piece(shape, grid);
    expect(piece.posX).toBe(3);
    expect(piece.posY).toBe(0);
  });

  it('should detect valid movement', () => {
    const grid = new GameGrid(10, 20);
    const shape = ShapeType.CUBE();
    const piece = new Piece(shape, grid);
    expect(piece.canMove('RIGHT', grid)).toBe(true);
  });

  it('should move piece', () => {
    const grid = new GameGrid(10, 20);
    const shape = ShapeType.CUBE();
    const piece = new Piece(shape, grid);
    const oldX = piece.posX;
    piece.move('RIGHT');
    expect(piece.posX).toBe(oldX + 1);
  });

  it('should drop piece to floor', () => {
    const grid = new GameGrid(10, 20);
    const shape = ShapeType.CUBE();
    const piece = new Piece(shape, grid);
    piece.drop(grid);
    expect(piece.posY).toBe(grid.height - 2);
  });
});
