import { describe, it, expect } from 'vitest';
import GameSquare from '../../src/ui/GameSquare.js';
import Block from '../../src/game/Block.js';

describe('GameSquare', () => {
  it('renders active blocks without muting filter', () => {
    const square = new GameSquare(0, 0, 40, 40);
    const block = new Block('red');

    square.fillWithBlock(block);

    expect(square.blockElem.style.backgroundColor).toBe('red');
    expect(square.blockElem.style.filter).toBe('none');
  });

  it('renders landed blocks with a muted filter', () => {
    const square = new GameSquare(0, 0, 40, 40);
    const block = new Block('blue');
    block.setActive(false);

    square.fillWithBlock(block);

    expect(square.blockElem.style.backgroundColor).toBe('blue');
    expect(square.blockElem.style.filter).toBe('saturate(55%) brightness(85%)');
  });
});