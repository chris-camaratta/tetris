import { describe, it, expect } from 'vitest';
import { randomInt } from '../../src/core/Random.js';

describe('Random', () => {
  it('should return number less than max', () => {
    for (let i = 0; i < 100; i++) {
      const r = randomInt(7);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(7);
    }
  });

  it('should return different values', () => {
    const values = new Set();
    for (let i = 0; i < 20; i++) {
      values.add(randomInt(7));
    }
    expect(values.size).toBeGreaterThan(1);
  });
});
