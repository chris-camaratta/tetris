import EventEmitter from './EventEmitter.js';
import Timer from './Timer.js';
import GameState from '../game/GameState.js';
import GameRenderer from '../ui/GameRenderer.js';
import KeyboardHandler from '../ui/KeyboardHandler.js';
import Settings from '../ui/Settings.js';
import UIComponents from '../ui/UIComponents.js';

export default class Game extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.settings = new Settings();
    this.gameState = new GameState(this.settings.cols, this.settings.rows, this.settings.startLevel);
    this.gameRenderer = new GameRenderer(this.gameState, '#gamearea');
    this.keyboardHandler = new KeyboardHandler(this.settings, (keyCode) => this._onKeyPress(keyCode));
    this.timer = new Timer();
    
    this._wireUpGameStateListeners();
    this._wireUpUIListeners();
    this._initializeUI();
  }

  _wireUpGameStateListeners() {
    this.gameState.on('started', () => {
      this.timer.setIntervalMs(this._calculateTimerSpeed());
      this.timer.start();
    });
    
    this.gameState.on('paused', () => {
      this.timer.stop();
      this._showPauseOverlay(true);
    });
    
    this.gameState.on('resumed', () => {
      this._showPauseOverlay(false);
      this.timer.start();
    });
    
    this.gameState.on('levelChanged', () => {
      this.timer.setIntervalMs(this._calculateTimerSpeed());
      this.gameRenderer.renderScoreboard();
    });
    
    this.gameState.on('scoreChanged', () => {
      this.gameRenderer.renderScoreboard();
    });
    
    this.timer.addTimerAction(this);
  }

  _wireUpUIListeners() {
    this.settings.on('keybindingChanged', ({ action, keyCode }) => {
      this.settings.updateKeybinding(action, keyCode);
    });
  }

  _initializeUI() {
    UIComponents.createControls(this.settings, (action, keyCode) => {
      this.settings.updateKeybinding(action, keyCode);
    });
    
    UIComponents.createGeneralSettings(this.settings, {
      onLevelChanged: (level) => this.settings.setStartLevel(level),
      onColsChanged: (cols) => this.settings.setCols(cols),
      onRowsChanged: (rows) => this.settings.setRows(rows),
      onStartClicked: () => this.run()
    });
    
    UIComponents.createStatsTracker();
    UIComponents.createScoreboardView(this.gameState.scoreboard);
    
    this.gameRenderer.renderScoreboard();
    this.gameRenderer.renderNextPreview('#nextgrid');
    this.gameRenderer.renderHoldPreview('#holdgrid');
  }

  run() {
    this.gameState.reset();
    this.gameState.start();
  }

  pause() {
    this.gameState.pause();
  }

  resume() {
    this.gameState.resume();
  }

  reset() {
    this.timer.stop();
    this.gameState.reset();
    this._showPauseOverlay(false);
  }

  onTimerAction() {
    this.gameState.tick();
  }

  _onKeyPress(keyCode) {
    const keys = this.settings.controls;
    
    if (keyCode === keys.PAUSE.id) {
      if (this.gameState.paused) this.resume();
      else if (this.gameState.running) this.pause();
    } else if (this.gameState.paused || !this.gameState.running) {
      return;
    } else if (keyCode === keys.HOLD.id) {
      this.gameState.swapHeldPiece();
      this.gameRenderer.renderHoldPreview('#holdgrid');
      this.gameRenderer.renderNextPreview('#nextgrid');
      this.gameRenderer.render();
    } else if (keyCode === keys.RIGHT.id) {
      this.gameState.movePiece('RIGHT');
    } else if (keyCode === keys.LEFT.id) {
      this.gameState.movePiece('LEFT');
    } else if (keyCode === keys.CW.id) {
      this.gameState.rotatePiece('CW');
    } else if (keyCode === keys.CCW.id) {
      this.gameState.rotatePiece('CCW');
    } else if (keyCode === keys.DROP.id) {
      this.gameState.hardDrop();
    } else if (keyCode === keys.FLIP.id) {
      this.gameState.flipPiece();
    } else if (keyCode === keys.DOWN.id) {
      this.gameState.movePiece('DOWN');
    }
  }

  _calculateTimerSpeed() {
    const level = this.gameState.scoreboard.getLevel();
    const minTimeout = 100;
    const maxTimeout = 1000;
    const asymptote = (15 / -level) + (15 - 0.5);
    return maxTimeout * (15 - asymptote) / 15;
  }

  _showPauseOverlay(show) {
    const overlay = document.getElementById('pauseoverlay');
    if (overlay) overlay.style.display = show ? 'block' : 'none';
  }
}
