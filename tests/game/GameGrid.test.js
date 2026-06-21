import { describe, it, expect } from 'vitest';
import GameGrid from '../../src/game/GameGrid.js';
import Block from '../../src/game/Block.js';

describe('GameGrid', () => {
  it('should create grid with width and height', () => {
    const grid = new GameGrid(10, 20);
    expect(grid.width).toBe(10);
    expect(grid.height).toBe(20);
  });

  it('should start with empty cells', () => {
    const grid = new GameGrid(10, 20);
    expect(grid.isCellOccupied(5, 10)).toBe(false);
  });

  it('should occupy cells', () => {
    const grid = new GameGrid(10, 20);
    const block = new Block('red');
    grid.occupyCell(5, 10, block);
    expect(grid.isCellOccupied(5, 10)).toBe(true);
  });

  it('should detect out of bounds as occupied', () => {
    const grid = new GameGrid(10, 20);
    expect(grid.isCellOccupied(-1, 10)).toBe(true);
    expect(grid.isCellOccupied(10, 10)).toBe(true);
    expect(grid.isCellOccupied(5, 20)).toBe(true);
  });

  it('should detect full rows', () => {
    const grid = new GameGrid(3, 3);
    for (let x = 0; x < 3; x++) {
      grid.occupyCell(x, 0, new Block('red'));
    }
    expect(grid.isRowFull(0)).toBe(true);
    expect(grid.isRowFull(1)).toBe(false);
  });

  it('should clear full rows', () => {
    const grid = new GameGrid(3, 3);
    for (let x = 0; x < 3; x++) {
      grid.occupyCell(x, 0, new Block('red'));
    }

    const cleared = grid.clearFullRows();

    expect(cleared).toBe(1);
    expect(grid.isRowFull(0)).toBe(false);
    expect(grid.isCellOccupied(0, 0)).toBe(false);
  });
});
