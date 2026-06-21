import { describe, it, expect } from 'vitest';
import PieceStorage from '../../src/game/PieceStorage.js';
import Piece from '../../src/game/Piece.js';
import GameGrid from '../../src/game/GameGrid.js';
import ShapeType from '../../src/game/ShapeType.js';

describe('PieceStorage', () => {
  it('should store piece', () => {
    const storage = new PieceStorage();
    const grid = new GameGrid(10, 20);
    const piece = new Piece(ShapeType.CUBE(), grid);
    storage.store(piece);
    expect(storage.retrieve()).toBe(piece);
  });

  it('should only allow one swap per piece', () => {
    const storage = new PieceStorage();
    const grid = new GameGrid(10, 20);
    const piece = new Piece(ShapeType.CUBE(), grid);
    const result1 = storage.store(piece);
    const result2 = storage.store(piece);
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  it('should swap pieces', () => {
    const storage = new PieceStorage();
    const grid = new GameGrid(10, 20);
    const piece1 = new Piece(ShapeType.CUBE(), grid);
    const piece2 = new Piece(ShapeType.LINE(), grid);
    
    storage.store(piece1);
    storage.resetTurn();
    const swapped = storage.store(piece2);
    
    expect(swapped).toBe(piece1);
    expect(storage.retrieve()).toBe(piece2);
  });

  it('should reset', () => {
    const storage = new PieceStorage();
    storage.turnUsed = true;
    storage.reset();
    expect(storage.turnUsed).toBe(false);
    expect(storage.storedPiece).toBeNull();
  });
});
