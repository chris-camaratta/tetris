# BUGS

This file tracks verified browser gameplay bugs, reproduction steps, and resolutions.

## Bug 1: Next-piece preview blocks invisible

- Steps to reproduce:
  1. Open `index.htm` and click Start Game.
  2. Observe the next-piece preview at `#nextgrid`.
  3. Inspect the preview block styling.
- Expected result:
  - Each preview block should be visible with the color of the next tetromino.
- Actual result:
  - Preview blocks were present in the DOM but rendered transparent because the CSS used `backgroundColor` instead of `background-color`.
- Files:
  - `src/ui/GameRenderer.js`
- Resolution:
  - Updated `src/ui/GameRenderer.js` to use the valid CSS declaration `background-color` in preview block inline styles.
  - Verified preview blocks now render correctly with tetromino colors in `#nextgrid`.

## Bug 2: Move Right input ignored

- Steps to reproduce:
  1. Open `index.htm` and click Start Game.
  2. Press the right arrow key.
  3. Observe the active tetromino position.
- Expected result:
  - The active piece should move one cell to the right.
- Actual result:
  - The piece remains in the same column while left movement works.
- Files:
  - `src/core/Game.js`
- Resolution:
  - Added missing `RIGHT` key mapping in `src/core/Game.js` so right-arrow triggers `gameState.movePiece('RIGHT')`.
