import { describe, it, expect } from 'vitest';
import ScoreBoard from '../../src/game/ScoreBoard.js';

describe('ScoreBoard', () => {
  it('should initialize with level and zero score', () => {
    const sb = new ScoreBoard(1);
    expect(sb.getScore()).toBe(0);
    expect(sb.getLevel()).toBe(1);
    expect(sb.getLines()).toBe(0);
  });

  it('should update score', () => {
    const sb = new ScoreBoard(1);
    sb.updateScore(1);
    expect(sb.getScore()).toBe(100);
    expect(sb.getLines()).toBe(1);
  });

  it('should calculate factorial for multiple lines', () => {
    const sb = new ScoreBoard(1);
    sb.updateScore(2);
    expect(sb.getScore()).toBe(200); // 2! * 100
  });

  it('should level up at threshold', () => {
    const sb = new ScoreBoard(1);
    let levelChanged = false;
    sb.on('levelChanged', () => { levelChanged = true; });
    
    for (let i = 0; i < 11; i++) {
      sb.updateScore(1);
    }
    
    expect(levelChanged).toBe(true);
    expect(sb.getLevel()).toBe(2);
  });

  it('should set level', () => {
    const sb = new ScoreBoard(1);
    sb.setLevel(5);
    expect(sb.getLevel()).toBe(5);
  });

  it('should cap level at max', () => {
    const sb = new ScoreBoard(20);
    expect(sb.getLevel()).toBe(ScoreBoard.MaxLevel);
  });
});
