import { describe, it, expect } from 'vitest';
import Shape from '../../src/game/Shape.js';

describe('Shape', () => {
  it('should create shape with id, geometry, color', () => {
    const shape = new Shape(0, [[1,1],[1,1]], 'yellow');
    expect(shape.getId()).toBe(0);
    expect(shape.getColor()).toBe('yellow');
    expect(shape.getGeometry()).toEqual([[1,1],[1,1]]);
  });
});
