import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Timer from '../../src/core/Timer.js';

describe('Timer', () => {
  let timer;

  beforeEach(() => {
    timer = new Timer();
  });

  afterEach(() => {
    timer.stop();
  });

  it('should start and stop', () => {
    expect(timer.timerIsActive).toBe(false);
    timer.start();
    expect(timer.timerIsActive).toBe(true);
    timer.stop();
    expect(timer.timerIsActive).toBe(false);
  });

  it('should call timer actions', async () => {
    const action = { onTimerAction: vi.fn() };
    timer.addTimerAction(action);
    timer.setIntervalMs(10);
    timer.start();
    await new Promise(resolve => setTimeout(resolve, 50));
    timer.stop();
    expect(action.onTimerAction).toHaveBeenCalled();
  });

  it('should toggle', () => {
    timer.toggle();
    expect(timer.timerIsActive).toBe(true);
    timer.toggle();
    expect(timer.timerIsActive).toBe(false);
  });
});
