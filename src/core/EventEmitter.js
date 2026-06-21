export default class EventEmitter {
  constructor() {
    this._handlers = new Map();
  }
  on(event, handler) {
    if (!this._handlers.has(event)) this._handlers.set(event, []);
    this._handlers.get(event).push(handler);
  }
  off(event, handler) {
    if (!this._handlers.has(event)) return;
    const arr = this._handlers.get(event).filter(h => h !== handler);
    this._handlers.set(event, arr);
  }
  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
  emit(event, ...args) {
    if (!this._handlers.has(event)) return;
    for (const h of [...this._handlers.get(event)]) {
      try { h(...args); } catch (e) { console.error(e); }
    }
  }
  clear(event) {
    if (this._handlers.has(event)) this._handlers.delete(event);
  }
}
