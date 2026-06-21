import { describe, it, expect, beforeEach, vi } from 'vitest';
import UIComponents from '../../src/ui/UIComponents.js';
import Settings from '../../src/ui/Settings.js';

describe('UIComponents', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="settingsarea"><dl id="controls"></dl><dl id="generalsettings"></dl></div>';
  });

  it('renders controls from Move Left to End Game', () => {
    UIComponents.createControls(new Settings());

    const labels = Array.from(document.querySelectorAll('#controls dt')).map((node) => node.textContent);

    expect(labels).toEqual([
      'Move Left',
      'Move Right',
      'Pause Game',
      'Soft Drop',
      'Flip',
      'Hard Drop',
      'Rotate CCW',
      'Rotate CW',
      'Hold',
      'End Game'
    ]);
  });

  it('renders general settings in key-value rows with a Start Game button', () => {
    UIComponents.createGeneralSettings(new Settings());

    const labels = Array.from(document.querySelectorAll('#generalsettings dt')).map((node) => node.textContent);
    expect(labels).toEqual(['Start Level', 'Columns', 'Rows']);

    const inputs = document.querySelectorAll('#generalsettings dd input[type="number"]');
    expect(inputs).toHaveLength(3);

    const startButton = document.querySelector('#generalsettings dd input[type="button"]');
    expect(startButton).not.toBeNull();
    expect(startButton.value).toBe('Start Game');
  });

  it('calls start callback when Start Game is clicked', () => {
    const onStartClicked = vi.fn();
    UIComponents.createGeneralSettings(new Settings(), { onStartClicked });

    const startButton = document.querySelector('#generalsettings dd input[type="button"]');
    startButton.click();

    expect(onStartClicked).toHaveBeenCalledTimes(1);
  });
});