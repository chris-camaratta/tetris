# Tetris Design And Architecture

## Overview

This is basically a tetris clone. I added a "flip" feature to appease my ADD, making it easier to make sure there
are no holes on the board. Yes, that makes the game easier too; the feature can be disabled by unassigning the keyboard shortcut, or simply not using it, ...or, you know, writing your own clone.

The game board is pure HTML because, at the time this was created that was the only option. I have no plans to update because moving to canvas would force me to create a whole infrastructure for rendering squares on a surface, and, well, HTML seems quite adept at that.

The statistics section was added to help improve the randomness algorithm, which in early versions relied on `Math.random()` which, it turns out, really isn't all that random and would "glom on" to particular pieces and put them out at might higher (and lower) rates than others. For a time this was remedied with an ALEA Randomisation algorithm, but that was subsequently replaced as the language evolved and now seems to work fine with JavaScript's `crypto` interface.

### Scoring Points

Scoring is handled by `ScoreBoard.updateScore(rowsCleared)`. Points earned are scaled based on the number of points scored, encouraging players (well, me...) to accumulate rows to maximize their score.

Algorithm:
    `pointsAwarded = factorial(rowsCleared) * 100`

This yields per-clear point values:
- 1 line: 1! * 100 = 100
- 2 lines: 2! * 100 = 200
- 3 lines: 3! * 100 = 600
- 4 lines: 4! * 100 = 2400

### Drop Speed Per Level

Every time 10 lines are cleared the level is raised and the piece drop rate is increased. Automatic falling speed
is computed by `Game._calculateTimerSpeed()` and applied via `Timer.setIntervalMs(...)`. Lower interval means faster
falling.

The initial version of this game used scaled drop speed using linear interpolation. This was very challenging; there
was almost no perceivable difference between levels 1 and 7, but after that the game became very hard, very fast.
The drop rate now follows a Pseudo‑logarithmic scale because it turns out that people perceive time differences
logarithmically!

Algorithm:

1. Read current level from scoreboard.
2. Use constants:

    `maxTimeout = 1000 (ms)`

3. Compute asymptote term:

    `asymptote = (15 / -level) + (15 - 0.5)`

4. Compute interval in milliseconds:

    `intervalMs = maxTimeout * (15 - asymptote) / 15`

5. When level changes, re-apply the computed interval to the running timer.

Equivalent simplified form:

`intervalMs = 1000 * ((0.5 + 15 / level) / 15)`

Examples:

- Level 1: about 1033 ms
- Level 5: about 233 ms
- Level 10: about 133 ms
- Level 15: about 100 ms

## Three-Layer Design

The rest of this document is AI generated. The pictures really helped me understand the design I came up with all those years (decades..!) ago. It is not as bad as I thought it would be! The current design follows the original's and preserves the original logic and (really very ugly) styling for the most part, but with more modern conventions/language constructs (e.g. `class`, `import ...`, etc.).

### Layer 1: Core (src/core)

- EventEmitter.js: lightweight pub/sub event system
- Random.js: random number generation
- Timer.js: game tick timer
- Game.js: controller that wires state, renderer, input, and timer

Dependencies: none

### Layer 2: Game Logic (src/game)

- Shape and ShapeType define tetromino geometry and color
- GameGrid and Cell track occupancy
- Block and Piece model active and placed blocks
- Collision validates movement and transforms geometry
- ShapeGenerator produces upcoming pieces
- PieceStorage manages hold behavior
- ScoreBoard manages score, lines, and level
- GameState is the central state machine and event source

Dependencies: core only

### Layer 3: UI Rendering (src/ui)

- GameSquare renders one grid cell
- GameRenderer listens to game-state events and updates DOM
- KeyboardHandler captures keyboard input
- Settings stores keybindings and game settings
- UIComponents builds controls and settings UI

Dependencies: game logic

## Class Diagram

```mermaid
classDiagram
    class EventEmitter {
        -handlers
        +on(event, handler)
        +off(event, handler)
        +emit(event, data)
        +once(event, handler)
        +clear(event)
    }

    class Random {
        +randomInt(max)
    }

    class Timer {
        -intervalMs
        -timerIsActive
        -clock
        -events
        +addTimerAction(action)
        +start()
        +stop()
        +toggle()
        +setIntervalMs(ms)
    }

    class Game {
        -gameState
        -gameRenderer
        -keyboardHandler
        -timer
        +run()
        +pause()
        +resume()
        +reset()
    }

    class GameState {
        -gameGrid
        -activePiece
        -nextPiece
        -heldPiece
        -scoreboard
        -shapeGenerator
        -pieceStorage
        -running
        -paused
        -stats
        +spawnNewPiece()
        +rotatePiece(direction)
        +movePiece(direction)
        +hardDrop()
        +flipPiece()
        +swapHeldPiece()
        +clearFullRows()
        +tick()
        +reset()
    }

    class Shape {
        -id
        -geometryGrid
        -color
        +getGeometry()
        +getColor()
        +getId()
    }

    class ShapeType {
        +CUBE()
        +LINE()
        +ELBOW1()
        +ELBOW2()
        +ZIGZAG1()
        +ZIGZAG2()
        +TEE()
    }

    class GameGrid {
        -width
        -height
        -cells
        +isCellOccupied(x, y)
        +occupyCell(x, y, block)
        +clearCell(x, y)
        +getRow(y)
        +clearFullRows()
        +clearAllRows()
    }

    class Cell {
        -occupied
        +fill(block)
        +empty()
        +isOccupied()
    }

    class Block {
        -id
        -color
        -pieceId
        -isActive
        +getColor()
        +setActive(flag)
        +getId()
    }

    class Collision {
        +canMoveTo(piece, grid, x, y)
        +canRotate(piece, grid)
        +canFlip(piece, grid)
        +rotateGeometry(grid, direction)
        +flipGeometry(grid)
    }

    class Piece {
        -id
        -shapeId
        -shapeGeometry
        -posX
        -posY
        -color
        -blocks
        +canMove(direction, grid)
        +move(direction)
        +rotate(direction, grid)
        +drop(grid)
        +flip(grid)
        +getBlocks()
        +occupyGridCells(grid)
    }

    class ShapeGenerator {
        -nextShape
        +getNextShape()
        +peekNext()
        +reset()
    }

    class PieceStorage {
        -storedPiece
        -turnUsed
        +store(piece)
        +retrieve()
        +reset()
        +resetTurn()
    }

    class ScoreBoard {
        -score
        -lines
        -level
        +updateScore(rowsCleared)
        +setLevel(level)
        +getScore()
        +getLevel()
        +getLines()
    }

    class GameRenderer {
        -gameState
        -gameArea
        -gameSquares
        +render()
        +renderScoreboard()
        +renderStats()
        +renderNextPreview()
        +renderHoldPreview()
        +renderGameOver()
    }

    class GameSquare {
        -elem
        -occupied
        +fillWithBlock(block)
        +empty()
    }

    class UIComponents {
        +createControls(settings)
        +createGeneralSettings(settings)
        +createStatsTracker()
        +createScoreboardView(scoreboard)
    }

    class KeyboardHandler {
        -settings
        -onKeyPress
        +handleKeyDown(event)
        +handleKeyUp(event)
        +cancelAllTimers()
    }

    class Settings {
        -controls
        -rows
        -cols
        -startLevel
        +getRows()
        +getCols()
        +getStartLevel()
        +updateKeybinding(action, keyCode)
    }

    GameState --|> EventEmitter
    PieceStorage --|> EventEmitter
    ScoreBoard --|> EventEmitter

    Game --> GameState
    Game --> GameRenderer
    Game --> KeyboardHandler
    Game --> Settings
    Game --> Timer

    GameState *-- GameGrid
    GameState *-- Piece
    GameState *-- ScoreBoard
    GameState *-- ShapeGenerator
    GameState *-- PieceStorage

    ShapeGenerator --> Random
    ShapeGenerator --> Shape
    GameGrid *-- Cell
    Cell --> Block
    Piece --> Collision
    GameRenderer --> GameState
    GameRenderer *-- GameSquare
    KeyboardHandler --> Settings
```

## Event Flow

User input or timer tick triggers Game methods, Game delegates to GameState, GameState mutates state and emits events, and GameRenderer updates the DOM by listening to those events.

## Sequence Diagrams

### 1. Page Load

```mermaid
sequenceDiagram
    participant User
    participant Browser as Browser/DOM
    participant index as index.js
    participant Game
    participant GameState
    participant GameRenderer
    participant KeyboardHandler
    participant Settings
    participant Timer

    User->>Browser: Load index.htm
    Browser->>Browser: Parse HTML, create DOM elements
    Browser->>index: Execute index.js (module)
    index->>Game: new Game()
    Game->>Settings: new Settings()
    Settings->>Settings: Parse default keybindings
    Game->>GameState: new GameState(rows, cols, level)
    GameState->>GameState: Initialize empty gameGrid
    GameState->>GameState: Initialize shapeGenerator
    GameState->>GameState: Initialize pieceStorage
    GameState->>GameState: Initialize scoreboard
    Game->>GameRenderer: new GameRenderer(gameState, DOM)
    GameRenderer->>GameRenderer: Create GameSquare objects for grid
    GameRenderer->>GameRenderer: Render initial empty grid
    Game->>KeyboardHandler: new KeyboardHandler(settings)
    KeyboardHandler->>Browser: Attach keydown/keyup listeners
    Game->>Timer: new Timer()
    index->>Browser: Attach start button listener
    Note over User,Timer: Page load complete and the game is ready to start
```

The page bootstraps the modular game controller, creates the logic layer, then wires the renderer and keyboard handler to the DOM.

### 2. Game Start

```mermaid
sequenceDiagram
    participant User
    participant Browser as Browser/DOM
    participant Game
    participant GameState
    participant ShapeGenerator
    participant Piece
    participant GameRenderer
    participant Timer

    User->>Browser: Click "Start Game" button
    Browser->>Game: onStartClicked()
    Game->>Game: run()
    Game->>GameState: reset()
    GameState->>GameState: Clear gameGrid
    GameState->>GameState: Reset score/level/lines
    Game->>GameState: spawnNewPiece()
    GameState->>ShapeGenerator: getNextShape()
    ShapeGenerator->>ShapeGenerator: getRandomNumber(7)
    ShapeGenerator-->>GameState: Returns Shape object
    GameState->>Piece: new Piece(shape, gameGrid)
    Piece->>Piece: Create blocks from shape geometry
    Piece->>Piece: Position at top-center
    Piece-->>GameState: Piece created
    GameState->>GameState: activePiece = piece
    GameState->>GameState: Emit "pieceSpawned" event
    GameRenderer->>GameState: Listen for "pieceSpawned" event
    GameRenderer->>GameRenderer: renderActivePiece()
    GameRenderer->>Browser: Update DOM with piece blocks
    GameRenderer->>GameRenderer: renderNextPreview()
    GameRenderer->>Browser: Update next piece preview
    Game->>Timer: setIntervalMs(level-based speed)
    Game->>Timer: start()
    Timer->>Timer: Begin tick() every N ms
    Note over User,Timer: Game started and the first piece is active
```

Starting the game resets logic state, spawns the first piece, refreshes the previews, and begins the falling timer.

### 3. Player Moves

```mermaid
sequenceDiagram
    participant User
    participant KeyboardHandler
    participant Game
    participant GameState
    participant Piece as Piece/Collision
    participant GameGrid
    participant GameRenderer
    participant ScoreBoard
    participant Timer

    Note over User,Timer: Movement actions such as left/right, rotation, drop, flip, and hold

    User->>KeyboardHandler: Press LEFT/RIGHT arrow
    KeyboardHandler->>Game: onKeyPress(LEFT_or_RIGHT)
    Game->>GameState: movePiece("LEFT" or "RIGHT")
    GameState->>Piece: canMove(direction, gameGrid)
    Piece->>Piece: Test new X position
    Piece->>GameGrid: Check collision at (newX, currentY)
    alt Collision detected
        GameGrid-->>Piece: BLOCKED
        Piece-->>GameState: false
        GameState->>GameState: Keep current position
    else Movement valid
        GameGrid-->>Piece: OK
        Piece-->>GameState: true
        GameState->>Piece: move(direction)
        Piece->>Piece: posX = newX
        GameState->>GameState: Emit "pieceMoved" event
        GameRenderer->>GameRenderer: renderActivePiece()
    end

    User->>KeyboardHandler: Press CW/CCW
    KeyboardHandler->>Game: onKeyPress(ROTATE)
    Game->>GameState: rotatePiece(direction)
    GameState->>Piece: canRotate(direction, gameGrid)
    Piece->>Piece: Calculate rotated geometry
    Piece->>GameGrid: Check collision with rotated shape
    alt Rotation blocked
        Piece-->>GameState: false
    else Rotation valid
        Piece-->>GameState: true
        GameState->>Piece: rotate(direction)
        GameState->>GameState: Emit "pieceMoved" event
        GameRenderer->>GameRenderer: renderActivePiece()
    end

    User->>KeyboardHandler: Press DOWN
    KeyboardHandler->>Game: onKeyPress(SOFT_DROP)
    Game->>GameState: movePiece("DOWN")
    GameState->>Piece: canMove("DOWN", gameGrid)
    alt Piece can still fall
        GameState->>Piece: move("DOWN")
        GameRenderer->>GameRenderer: renderActivePiece()
    else Piece reaches bottom
        GameState->>GameState: occupyGridCells()
        GameState->>GameState: clearFullRows()
        GameState->>ScoreBoard: updateScore(rowsCleared)
        GameState->>GameState: spawnNewPiece()
    end

    User->>KeyboardHandler: Press SPACE
    KeyboardHandler->>Game: onKeyPress(HARD_DROP)
    Game->>GameState: hardDrop()
    GameState->>Piece: drop(gameGrid)
    GameState->>GameState: occupyGridCells()
    GameState->>GameState: clearFullRows()
    GameState->>GameState: spawnNewPiece()

    User->>KeyboardHandler: Press F
    KeyboardHandler->>Game: onKeyPress(FLIP)
    Game->>GameState: flipPiece()
    GameState->>Piece: flip(gameGrid)
    GameState->>GameState: Emit "pieceMoved" event

    User->>KeyboardHandler: Press H
    KeyboardHandler->>Game: onKeyPress(HOLD)
    Game->>GameState: swapHeldPiece()
    GameState->>GameState: Update hold storage
    GameState->>GameState: Emit "pieceSwapped" event
    GameRenderer->>GameRenderer: renderHoldPreview()
    GameRenderer->>GameRenderer: renderNextPreview()

    Note over User,Timer: Each valid action re-renders the board and previews
```

Player actions all route through the same controller path, with GameState owning legality checks, state mutation, scoring, and row clearing.

### 4. Pause And Resume

```mermaid
sequenceDiagram
    participant User
    participant KeyboardHandler
    participant Game
    participant GameState
    participant Timer
    participant GameRenderer
    participant Browser as Browser/DOM

    Note over User,Browser: Pause and resume toggle with ESC

    User->>KeyboardHandler: Press ESC
    KeyboardHandler->>Game: onKeyPress(PAUSE)
    alt Game is running
        Game->>Game: pause()
        Game->>GameState: paused = true
        GameState->>GameState: Emit "paused" event
        GameRenderer->>Browser: Show pause overlay
        Game->>Timer: stop()
        Timer->>Timer: Clear interval
        GameState->>KeyboardHandler: Ignore gameplay input while paused
    else Game is already paused
        Game->>Game: resume()
        Game->>GameState: paused = false
        GameState->>GameState: Emit "resumed" event
        GameRenderer->>Browser: Hide pause overlay
        Game->>Timer: start()
        Timer->>Timer: Re-establish interval
    end
    Note over User,Browser: ESC toggles back to the running state
```

The pause flow stops the timer, shows the overlay, and blocks gameplay input until the player resumes.

## Statistics Piece-Appearance Chart

The statistics panel includes a bar chart for visual piece-frequency comparison.

- Data source: gameState.stats.pieceCounts and gameState.stats.piecesPlaced
- Render location: GameRenderer.renderStats()
- Scaling: each bar height is normalized against the highest current piece count
- Visual mapping: seven fixed bars (shape IDs 0-6), color-matched to tetromino types
- Update trigger: chart is rebuilt whenever GameRenderer.render() runs