export default class Timer {
  constructor() {
    this.intervalMs = 1000;
    this.timerIsActive = false;
    this._events = [];
    this._clock = null;
  }
  addTimerAction(action) {
    this._events.push(action);
  }
  handleTimer() {
    for (const e of this._events) {
      try { e.onTimerAction(); } catch (ex) { console.error('Timer action error', ex); }
    }
  }
  setIntervalMs(ms) {
    this.intervalMs = ms;
    if (this.timerIsActive) {
      this.stop();
      this.start();
    }
  }
  start() {
    if (!this.timerIsActive) {
      this.timerIsActive = true;
      this._clock = setInterval(() => this.handleTimer(), this.intervalMs);
    }
  }
  stop() {
    this.timerIsActive = false;
    if (this._clock) clearInterval(this._clock);
    this._clock = null;
  }
  toggle() {
    if (this.timerIsActive) this.stop(); else this.start();
  }
}
