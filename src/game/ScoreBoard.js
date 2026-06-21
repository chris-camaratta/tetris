import EventEmitter from '../core/EventEmitter.js';

export default class ScoreBoard extends EventEmitter {
  static MaxLevel = 15;
  static MinLevel = 1;
  static LevelThresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
  
  constructor(startLevel = 1) {
    super();
    this.score = 0;
    this.lines = 0;
    this.level = Math.min(startLevel, ScoreBoard.MaxLevel);
  }
  updateScore(rowsCleared) {
    if (rowsCleared <= 0) return;
    this.lines += rowsCleared;
    const points = this._factorial(rowsCleared) * 100;
    this.score += points;
    
    const lbound = ScoreBoard.LevelThresholds[this.level - 1];
    const ubound = ScoreBoard.LevelThresholds[ScoreBoard.LevelThresholds.length - 1];
    if (this.lines >= lbound && this.lines < ubound) {
      this.level++;
      this.emit('levelChanged', { level: this.level });
    }
    this.emit('scoreChanged', { score: this.score, lines: this.lines });
  }
  setLevel(level) {
    this.level = Math.min(level, ScoreBoard.MaxLevel);
    this.emit('levelChanged', { level: this.level });
  }
  _factorial(num) {
    return num <= 1 ? 1 : num * this._factorial(num - 1);
  }
  getScore() { return this.score; }
  getLevel() { return this.level; }
  getLines() { return this.lines; }
}
