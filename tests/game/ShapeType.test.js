import { describe, it, expect } from 'vitest';
import ShapeType from '../../src/game/ShapeType.js';

describe('ShapeType', () => {
  it('should create all 7 shapes', () => {
    const shapes = ShapeType.Shapes;
    expect(shapes.length).toBe(7);
    expect(shapes).toContain('CUBE');
    expect(shapes).toContain('LINE');
    expect(shapes).toContain('TEE');
  });

  it('should create CUBE shape', () => {
    const cube = ShapeType.CUBE();
    expect(cube.getId()).toBe(0);
    expect(cube.getColor()).toBe('yellow');
    expect(cube.getGeometry()).toEqual([[1,1],[1,1]]);
  });

  it('should create LINE shape', () => {
    const line = ShapeType.LINE();
    expect(line.getId()).toBe(1);
    expect(line.getColor()).toBe('red');
    expect(line.getGeometry()).toEqual([[1,1,1,1]]);
  });
});
