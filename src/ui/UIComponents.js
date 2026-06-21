export default class UIComponents {
  static createControls(settings, onKeybindingChange) {
    const controlsDiv = document.getElementById('controls');
    if (!controlsDiv) return;
    
    controlsDiv.innerHTML = '';
    for (const [action, key] of Object.entries(settings.controls)) {
      const dt = document.createElement('dt');
      dt.textContent = key.name;
      
      const dd = document.createElement('dd');
      const input = document.createElement('input');
      input.type = 'text';
      input.name = action;
      input.value = this._getDisplayName(key.id);
      input.readOnly = true;
      
      input.addEventListener('focus', () => {
        input.value = '';
        input.style.backgroundColor = '#ffff99';
      });
      
      input.addEventListener('keyup', (ev) => {
        const keyCode = ev.which || ev.keyCode;
        input.value = this._getDisplayName(keyCode);
        input.blur();
        if (onKeybindingChange) onKeybindingChange(action, keyCode);
      });
      
      dd.appendChild(input);
      controlsDiv.appendChild(dt);
      controlsDiv.appendChild(dd);
    }
  }

  static createGeneralSettings(settings, callbacks = {}) {
    const settingsDiv = document.getElementById('generalsettings');
    if (!settingsDiv) return;
    
    settingsDiv.innerHTML = '';

    const levelLabel = document.createElement('dt');
    levelLabel.textContent = 'Start Level';
    const levelValue = document.createElement('dd');
    const levelInput = document.createElement('input');
    levelInput.type = 'number';
    levelInput.min = '1';
    levelInput.max = '15';
    levelInput.value = settings.startLevel;
    levelInput.addEventListener('change', () => {
      if (callbacks.onLevelChanged) callbacks.onLevelChanged(Number.parseInt(levelInput.value, 10));
    });
    levelValue.appendChild(levelInput);

    const colsLabel = document.createElement('dt');
    colsLabel.textContent = 'Columns';
    const colsValue = document.createElement('dd');
    const colsInput = document.createElement('input');
    colsInput.type = 'number';
    colsInput.min = '5';
    colsInput.max = '20';
    colsInput.value = settings.cols;
    colsInput.addEventListener('change', () => {
      if (callbacks.onColsChanged) callbacks.onColsChanged(Number.parseInt(colsInput.value, 10));
    });
    colsValue.appendChild(colsInput);

    const rowsLabel = document.createElement('dt');
    rowsLabel.textContent = 'Rows';
    const rowsValue = document.createElement('dd');
    const rowsInput = document.createElement('input');
    rowsInput.type = 'number';
    rowsInput.min = '5';
    rowsInput.max = '40';
    rowsInput.value = settings.rows;
    rowsInput.addEventListener('change', () => {
      if (callbacks.onRowsChanged) callbacks.onRowsChanged(Number.parseInt(rowsInput.value, 10));
    });
    rowsValue.appendChild(rowsInput);

    const startValue = document.createElement('dd');
    const startBtn = document.createElement('input');
    startBtn.type = 'button';
    startBtn.value = 'Start Game';
    startBtn.addEventListener('click', () => {
      if (callbacks.onStartClicked) callbacks.onStartClicked();
    });
    startValue.appendChild(startBtn);

    settingsDiv.appendChild(levelLabel);
    settingsDiv.appendChild(levelValue);
    settingsDiv.appendChild(colsLabel);
    settingsDiv.appendChild(colsValue);
    settingsDiv.appendChild(rowsLabel);
    settingsDiv.appendChild(rowsValue);
    settingsDiv.appendChild(startValue);
  }

  static createStatsTracker() {
    const statsDiv = document.getElementById('statistics');
    if (!statsDiv) return;
    
    statsDiv.innerHTML = '<div style="width: 200px; height: 100px; background: #f5f5f5; border: 1px solid #333;"></div>';
  }

  static createScoreboardView(scoreboard) {
    const scoreDiv = document.getElementById('scoreboard');
    if (!scoreDiv) return;
    
    scoreDiv.innerHTML = `
      <div><strong>Level:</strong> ${scoreboard.getLevel()}</div>
      <div><strong>Score:</strong> ${scoreboard.getScore()}</div>
      <div><strong>Lines:</strong> ${scoreboard.getLines()}</div>
    `;
  }

  static _getDisplayName(keyCode) {
    const keyMap = {
      8: 'backspace', 9: 'tab', 13: 'enter', 16: 'shift', 17: 'ctrl', 18: 'alt',
      27: 'escape', 32: 'spacebar', 37: 'left arrow', 38: 'up arrow', 39: 'right arrow',
      40: 'down arrow', 70: 'F', 72: 'H'
    };
    return keyMap[keyCode] || String.fromCharCode(keyCode).toLowerCase();
  }
}
