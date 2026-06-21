import { describe, it, expect } from 'vitest';
import ShapeGenerator from '../../src/game/ShapeGenerator.js';
import ShapeType from '../../src/game/ShapeType.js';

describe('ShapeGenerator', () => {
  it('should generate next shape', () => {
    const gen = new ShapeGenerator();
    const shape = gen.getNextShape();
    const generatedIds = ShapeType.Shapes.map((name) => ShapeType[name]().getId());

    expect(shape).toBeDefined();
    expect(generatedIds).toContain(shape.getId());
  });

  it('should peek next without consuming', () => {
    const gen = new ShapeGenerator();
    const peeked = gen.peekNext();
    const next = gen.getNextShape();
    expect(peeked.getId()).toBe(next.getId());
  });

  it('should reset', () => {
    const gen = new ShapeGenerator();
    gen.reset();
    expect(gen.peekNext()).toBeDefined();
  });
});
