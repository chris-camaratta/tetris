import { describe, it, expect } from 'vitest';
import Block from '../../src/game/Block.js';

describe('Block', () => {
  it('should create block with color', () => {
    const block = new Block('red');
    expect(block.getColor()).toBe('red');
    expect(block.getId()).toBeGreaterThan(0);
  });

  it('should track active state', () => {
    const block = new Block('blue');
    expect(block.isActive).toBe(true);
    block.setActive(false);
    expect(block.isActive).toBe(false);
  });

  it('should track piece id', () => {
    const block = new Block('yellow', 42);
    expect(block.pieceId).toBe(42);
  });
});
