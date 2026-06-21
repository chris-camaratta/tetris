# Developer Guide

## Setup

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
cd c:\src\tetris
npm install
```

## Running The Game

1. Open index.htm in a browser, for example file:///c:/src/tetris/index.htm
2. Click Start Game in the UI

Debug helpers in browser console:

```javascript
const g = window.__tetrisGame;
g.run();
g.pause();
g.resume();
g.reset();
```

## Testing

Run all tests:

```bash
npm test
```

Watch mode:

```bash
npm test -- --watch
```

Coverage:

```bash
npm test -- --coverage
```

## Project Layout

```text
tetris/
├── docs/
│   ├── design.md
│   ├── ARCHITECTURE.md
│   └── DEVELOPER.md
├── src/
│   ├── core/
│   ├── game/
│   ├── ui/
│   └── index.js
├── tests/
│   ├── core/
│   └── game/
├── index.htm
├── global.css
├── package.json
└── vitest.config.js
```

## Common Tasks

### Add A Gameplay Feature

1. Implement game logic in src/game
2. Emit or consume relevant GameState events
3. Update rendering in src/ui/GameRenderer.js
4. Add or update tests in tests/game

### Add A New Shape

1. Update src/game/ShapeType.js
2. Update tests/game/ShapeType.test.js
3. Verify previews and placement in browser

### Change Key Bindings

1. Edit defaults in src/ui/Settings.js
2. Verify controls panel updates and key handling

## Debugging Tips

```javascript
const g = window.__tetrisGame;
g.gameState.activePiece;
g.gameState.gameGrid.width;
g.gameState.scoreboard.getScore();
g.gameState.stats;
```

## Notes

- Architecture details and diagrams are maintained in docs/design.md
- Root-level legacy engine.js remains for historical reference only