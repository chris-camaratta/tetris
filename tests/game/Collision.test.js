import { describe, it, expect } from 'vitest';
import Collision from '../../src/game/Collision.js';
import GameGrid from '../../src/game/GameGrid.js';
import Block from '../../src/game/Block.js';

describe('Collision', () => {
  it('should detect wall collision (left)', () => {
    const grid = new GameGrid(10, 20);
    const piece = {
      posX: 0,
      posY: 0,
      shapeGeometry: [[1,1],[1,1]]
    };
    expect(Collision.canMoveTo(piece, grid, -1, 0)).toBe(false);
  });

  it('should detect wall collision (right)', () => {
    const grid = new GameGrid(10, 20);
    const piece = {
      posX: 9,
      posY: 0,
      shapeGeometry: [[1,1],[1,1]]
    };
    expect(Collision.canMoveTo(piece, grid, 9, 0)).toBe(false);
  });

  it('should detect occupied cell collision', () => {
    const grid = new GameGrid(10, 20);
    grid.occupyCell(5, 5, new Block('red'));
    const piece = {
      posX: 4,
      posY: 4,
      shapeGeometry: [[1,1],[1,1]]
    };
    expect(Collision.canMoveTo(piece, grid, 4, 4)).toBe(false);
  });

  it('should allow valid movement', () => {
    const grid = new GameGrid(10, 20);
    const piece = {
      posX: 4,
      posY: 4,
      shapeGeometry: [[1,0],[1,0]]
    };
    expect(Collision.canMoveTo(piece, grid, 5, 4)).toBe(true);
  });

  it('should rotate geometry into valid dimensions', () => {
    const geom = [[1,1,1,1]];
    const rotated = Collision.rotateGeometry(geom, 'CW');
    expect(rotated).toEqual([[1],[1],[1],[1]]);
  });

  it('should flip geometry horizontally', () => {
    const geom = [[1,0,0],[0,1,1]];
    const flipped = Collision.flipGeometry(geom);
    expect(flipped).toEqual([[0,0,1],[1,1,0]]);
  });

  it('should rotate geometry', () => {
    const geom = [[1,0],[1,0],[1,0],[1,0]];
    const rotated = Collision.rotateGeometry(geom, 'CW');
    expect(rotated.length).toBeGreaterThan(0);
  });
});
