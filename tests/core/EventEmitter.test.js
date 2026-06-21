import { describe, it, expect } from 'vitest';
import EventEmitter from '../../src/core/EventEmitter.js';

describe('EventEmitter', () => {
  it('should emit and listen to events', () => {
    const ee = new EventEmitter();
    let called = false;
    ee.on('test', () => { called = true; });
    ee.emit('test');
    expect(called).toBe(true);
  });

  it('should pass data with events', () => {
    const ee = new EventEmitter();
    let data;
    ee.on('test', (payload) => { data = payload; });
    ee.emit('test', { x: 42 });
    expect(data.x).toBe(42);
  });

  it('should support multiple handlers', () => {
    const ee = new EventEmitter();
    let count = 0;
    ee.on('test', () => { count++; });
    ee.on('test', () => { count++; });
    ee.emit('test');
    expect(count).toBe(2);
  });

  it('should support once', () => {
    const ee = new EventEmitter();
    let count = 0;
    ee.once('test', () => { count++; });
    ee.emit('test');
    ee.emit('test');
    expect(count).toBe(1);
  });

  it('should support removing handlers', () => {
    const ee = new EventEmitter();
    let count = 0;
    const handler = () => { count++; };
    ee.on('test', handler);
    ee.off('test', handler);
    ee.emit('test');
    expect(count).toBe(0);
  });

  it('should not crash on handler error', () => {
    const ee = new EventEmitter();
    ee.on('test', () => { throw new Error('test'); });
    ee.on('test', () => { /* should still run */ });
    expect(() => ee.emit('test')).not.toThrow();
  });
});
