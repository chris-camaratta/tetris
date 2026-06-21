import Game from './core/Game.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const game = new Game();
    window.__tetrisGame = game;
    console.log('Tetris game initialized. Type game.run() to start.');
  } catch (ex) {
    console.error('Failed to initialize game:', ex);
  }
});

