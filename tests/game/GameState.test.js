import { describe, it, expect } from 'vitest';
import GameState from '../../src/game/GameState.js';

describe('GameState', () => {
  it('should initialize game state', () => {
    const state = new GameState(10, 20, 1);
    expect(state.width).toBe(10);
    expect(state.height).toBe(20);
    expect(state.running).toBe(false);
    expect(state.paused).toBe(false);
  });

  it('should spawn piece on start', () => {
    const state = new GameState(10, 20, 1);
    state.start();
    expect(state.running).toBe(true);
    expect(state.activePiece).toBeDefined();
  });

  it('should pause and resume', () => {
    const state = new GameState(10, 20, 1);
    state.start();
    state.pause();
    expect(state.paused).toBe(true);
    state.resume();
    expect(state.paused).toBe(false);
  });

  it('should move piece left/right', () => {
    const state = new GameState(10, 20, 1);
    state.start();
    const oldX = state.activePiece.posX;
    state.movePiece('RIGHT');
    expect(state.activePiece.posX).toBe(oldX + 1);
  });

  it('should detect game over when grid fills', () => {
    const state = new GameState(10, 20, 1);
    let gameOverEmitted = false;
    state.on('gameOver', () => { gameOverEmitted = true; });
    
    state.gameGrid.height = 2;
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 2; y++) {
        state.gameGrid.occupyCell(x, y, { getColor: () => 'red', isActive: false });
      }
    }
    
    state.start();
    expect(gameOverEmitted).toBe(true);
  });

  it('should reset state', () => {
    const state = new GameState(10, 20, 1);
    state.start();
    state.reset();
    expect(state.running).toBe(false);
    expect(state.activePiece).toBeNull();
  });

  it('should ignore second hold in the same turn', () => {
    const state = new GameState(10, 20, 1);
    state.start();

    const firstActive = state.activePiece;
    const firstNext = state.nextPiece;

    state.swapHeldPiece();

    const activeAfterFirstHold = state.activePiece;
    const nextAfterFirstHold = state.nextPiece;

    expect(activeAfterFirstHold).toBe(firstNext);
    expect(state.pieceStorage.retrieve()).toBe(firstActive);

    state.swapHeldPiece();

    expect(state.activePiece).toBe(activeAfterFirstHold);
    expect(state.nextPiece).toBe(nextAfterFirstHold);
    expect(state.pieceStorage.retrieve()).toBe(firstActive);
  });
});
