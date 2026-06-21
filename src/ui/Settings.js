import EventEmitter from '../core/EventEmitter.js';

const DEFAULT_KEYS = {
  LEFT: { id: 37, name: 'Move Left', repeat: 150 },
  RIGHT: { id: 39, name: 'Move Right', repeat: 150 },
  PAUSE: { id: 27, name: 'Pause Game', repeat: 0 },
  DOWN: { id: 40, name: 'Soft Drop', repeat: 100 },
  FLIP: { id: 70, name: 'Flip', repeat: 0 },
  DROP: { id: 32, name: 'Hard Drop', repeat: 200 },
  CCW: { id: 38, name: 'Rotate CCW', repeat: 200 },
  CW: { id: 9, name: 'Rotate CW', repeat: 200 },
  HOLD: { id: 72, name: 'Hold', repeat: 0 },
  QUIT: { id: 0, name: 'End Game', repeat: 0 }
};

export default class Settings extends EventEmitter {
  constructor() {
    super();
    this.controls = { ...DEFAULT_KEYS };
    this.rows = 20;
    this.cols = 10;
    this.startLevel = 1;
  }
  getRows() { return this.rows; }
  getCols() { return this.cols; }
  getStartLevel() { return this.startLevel; }
  setRows(r) { this.rows = r; this.emit('settingsChanged'); }
  setCols(c) { this.cols = c; this.emit('settingsChanged'); }
  setStartLevel(l) { this.startLevel = l; this.emit('settingsChanged'); }
  updateKeybinding(action, keyCode) {
    if (this.controls[action]) {
      this.controls[action].id = keyCode;
      this.emit('keybindingChanged', { action, keyCode });
    }
  }
}
