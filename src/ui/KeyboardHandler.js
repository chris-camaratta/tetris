import EventEmitter from '../core/EventEmitter.js';

export default class KeyboardHandler extends EventEmitter {
  constructor(settings, onKeyPress) {
    super();
    this.settings = settings;
    this.onKeyPress = onKeyPress;
    this._timers = {};
    this._attachListeners();
  }
  _attachListeners() {
    document.addEventListener('keydown', (ev) => this._handleKeyDown(ev));
    document.addEventListener('keyup', (ev) => this._handleKeyUp(ev));
    window.addEventListener('blur', () => this.cancelAllTimers());
  }
  _handleKeyDown(ev) {
    const keyCode = ev.which || ev.keyCode;
    const key = this._findKey(keyCode);
    
    if (key && !(keyCode in this._timers)) {
      this._timers[keyCode] = null;
      if (this.onKeyPress) this.onKeyPress(keyCode);
      
      if (key.repeat > 0) {
        this._timers[keyCode] = setInterval(() => {
          if (this.onKeyPress) this.onKeyPress(keyCode);
        }, key.repeat);
      }
      ev.preventDefault();
    }
  }
  _handleKeyUp(ev) {
    const keyCode = ev.which || ev.keyCode;
    if (keyCode in this._timers) {
      if (this._timers[keyCode]) clearInterval(this._timers[keyCode]);
      delete this._timers[keyCode];
    }
  }
  _findKey(keyCode) {
    for (const key of Object.values(this.settings.controls)) {
      if (key.id === keyCode) return key;
    }
    return null;
  }
  cancelAllTimers() {
    for (const timer of Object.values(this._timers)) {
      if (timer) clearInterval(timer);
    }
    this._timers = {};
  }
}
