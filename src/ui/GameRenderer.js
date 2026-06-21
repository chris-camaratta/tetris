import GameSquare from './GameSquare.js';

const SHAPE_COLORS = ['yellow', 'red', 'blue', 'BlueViolet', 'green', 'RosyBrown', 'orange'];
const PREVIEW_SIZE = 4;

export default class GameRenderer {
  constructor(gameState, gameAreaSelector) {
    this.gameState = gameState;
    this.gameArea = document.querySelector(gameAreaSelector);
    this.blockHeight = 40;
    this.blockWidth = 40;
    this.gameSquares = [];
    this.previewGrids = new Map();
    this._createGrid();
    this._wireUpListeners();
  }
  _createGrid() {
    this.gameArea.innerHTML = '';
    this.gameArea.style.position = 'relative';
    this.gameArea.style.width = (this.gameState.width * this.blockWidth) + 'px';
    this.gameArea.style.height = (this.gameState.height * this.blockHeight) + 'px';
    this.gameArea.style.border = '5px double #333';
    this.gameArea.style.backgroundColor = 'white';
    
    for (let x = 0; x < this.gameState.width; x++) {
      this.gameSquares[x] = [];
      for (let y = 0; y < this.gameState.height; y++) {
        const sq = new GameSquare(x, y, this.blockHeight, this.blockWidth);
        this.gameSquares[x][y] = sq;
        this.gameArea.appendChild(sq.getElement());
      }
    }
  }
  _wireUpListeners() {
    this.gameState.on('pieceMoved', () => this.render());
    this.gameState.on('pieceSpawned', () => this.render());
    this.gameState.on('bottomReached', () => this.render());
    this.gameState.on('rowsCleared', () => this.render());
    this.gameState.on('piecePlaced', () => this.renderStats());
    this.gameState.on('gameOver', () => this.renderGameOver());
  }
  render() {
    this._renderGrid();
    this._renderActivePiece();
    this.renderScoreboard();
    this.renderStats();
    this.renderNextPreview('#nextgrid');
    this.renderHoldPreview('#holdgrid');
  }
  _renderGrid() {
    for (let x = 0; x < this.gameState.width; x++) {
      for (let y = 0; y < this.gameState.height; y++) {
        const sq = this.gameSquares[x][y];
        const cell = this.gameState.gameGrid.getCell(x, y);
        if (cell?.isOccupied()) {
          sq.fillWithBlock(cell.occupied);
        } else {
          sq.empty();
        }
      }
    }
  }
  _renderActivePiece() {
    if (!this.gameState.activePiece) return;
    this._renderPieceOnSquares(this.gameState.activePiece, this.gameSquares, {
      width: this.gameState.width,
      height: this.gameState.height,
      includePiecePosition: true
    });
  }
  renderGameOver() {
    alert(`Game Over!\nFinal Score: ${this.gameState.scoreboard.getScore()}\nLevel: ${this.gameState.scoreboard.getLevel()}`);
  }
  renderNextPreview(nextAreaSelector) {
    this._renderPreview(nextAreaSelector, this.gameState.nextPiece);
  }
  renderHoldPreview(holdAreaSelector) {
    this._renderPreview(holdAreaSelector, this.gameState.pieceStorage.retrieve());
  }
  _renderPreview(areaSelector, piece) {
    const previewGrid = this._getOrCreatePreviewGrid(areaSelector);
    if (!previewGrid) return;
    this._clearSquares(previewGrid.squares, previewGrid.width, previewGrid.height);
    if (!piece) return;
    this._renderPieceOnSquares(piece, previewGrid.squares, {
      width: previewGrid.width,
      height: previewGrid.height,
      includePiecePosition: false
    });
  }
  _getOrCreatePreviewGrid(areaSelector) {
    const area = document.querySelector(areaSelector);
    if (!area) return null;

    const existing = this.previewGrids.get(areaSelector);
    if (existing && existing.container === area) {
      return existing;
    }

    area.innerHTML = '';
    area.style.position = 'relative';
    area.style.width = (PREVIEW_SIZE * this.blockWidth) + 'px';
    area.style.height = (PREVIEW_SIZE * this.blockHeight) + 'px';
    area.style.backgroundColor = '#f5f5f5';
    area.style.border = '1px solid #ccc';

    const squares = [];
    for (let x = 0; x < PREVIEW_SIZE; x++) {
      squares[x] = [];
      for (let y = 0; y < PREVIEW_SIZE; y++) {
        const sq = new GameSquare(x, y, this.blockHeight, this.blockWidth);
        squares[x][y] = sq;
        area.appendChild(sq.getElement());
      }
    }

    const previewGrid = { container: area, squares, width: PREVIEW_SIZE, height: PREVIEW_SIZE };
    this.previewGrids.set(areaSelector, previewGrid);
    return previewGrid;
  }
  _clearSquares(squares, width, height) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        squares[x][y].empty();
      }
    }
  }
  _renderPieceOnSquares(piece, squares, opts) {
    const { width, height, includePiecePosition } = opts;
    let baseX = includePiecePosition ? piece.posX : 0;
    let baseY = includePiecePosition ? piece.posY : 0;

    if (!includePiecePosition) {
      const blocks = piece.getBlocks();
      const minOffsetX = Math.min(...blocks.map(({ offsetX }) => offsetX));
      const maxOffsetX = Math.max(...blocks.map(({ offsetX }) => offsetX));
      const minOffsetY = Math.min(...blocks.map(({ offsetY }) => offsetY));
      const maxOffsetY = Math.max(...blocks.map(({ offsetY }) => offsetY));
      const pieceWidth = maxOffsetX - minOffsetX + 1;
      const pieceHeight = maxOffsetY - minOffsetY + 1;

      baseX = Math.floor((width - pieceWidth) / 2) - minOffsetX;
      baseY = Math.floor((height - pieceHeight) / 2) - minOffsetY;
    }

    for (const { block, offsetX, offsetY } of piece.getBlocks()) {
      const x = baseX + offsetX;
      const y = baseY + offsetY;
      if (y >= 0 && y < height && x >= 0 && x < width) {
        squares[x][y].fillWithBlock(block);
      }
    }
  }
  renderScoreboard() {
    const sb = this.gameState.scoreboard;
    const elem = document.getElementById('scoreboard');
    if (elem) {
      elem.innerHTML = `
        <div><strong>Level:</strong> ${sb.getLevel()}</div>
        <div><strong>Score:</strong> ${sb.getScore()}</div>
        <div><strong>Lines:</strong> ${sb.getLines()}</div>
      `;
    }
  }
  renderStats() {
    const statsDiv = document.getElementById('statistics');
    if (!statsDiv) return;
    const stats = this.gameState.stats;
    const pieceCounts = SHAPE_COLORS.map((_, shapeId) => stats.pieceCounts[shapeId] || 0);
    const maxCount = Math.max(1, ...pieceCounts);
    statsDiv.innerHTML = `
      <div><strong>Pieces Placed:</strong> ${stats.piecesPlaced}</div>
      <div class="scoreboard-piece-chart" aria-label="Piece appearance bar chart">
        ${pieceCounts.map((count, shapeId) => {
          const heightPercent = Math.max(0, Math.round((count / maxCount) * 100));
          return `
            <div class="piece-bar-column" title="Shape ${shapeId}: ${count}">
              <div class="piece-bar" style="height: ${heightPercent}%; background: ${SHAPE_COLORS[shapeId]};"></div>
              <div class="piece-bar-label">${shapeId}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}
