import EventEmitter from '../core/EventEmitter.js';
import GameGrid from './GameGrid.js';
import Piece from './Piece.js';
import ShapeGenerator from './ShapeGenerator.js';
import PieceStorage from './PieceStorage.js';
import ScoreBoard from './ScoreBoard.js';
import Collision from './Collision.js';

export default class GameState extends EventEmitter {
  constructor(cols = 10, rows = 20, startLevel = 1) {
    super();
    this.width = cols;
    this.height = rows;
    this.gameGrid = new GameGrid(cols, rows);
    this.shapeGenerator = new ShapeGenerator();
    this.pieceStorage = new PieceStorage();
    this.scoreboard = new ScoreBoard(startLevel);
    this.activePiece = null;
    this.nextPiece = this._generateNextPiece();
    this.heldPiece = null;
    this.running = false;
    this.paused = false;
    this.stats = {
      piecesPlaced: 0,
      pieceCounts: {}
    };
  }

  _generateNextPiece() {
    const shape = this.shapeGenerator.getNextShape();
    return new Piece(shape, this.gameGrid);
  }

  spawnNewPiece() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this._generateNextPiece();
    
    if (!Collision.canMoveTo(this.activePiece, this.gameGrid, this.activePiece.posX, this.activePiece.posY)) {
      this.running = false;
      this.emit('gameOver', { score: this.scoreboard.getScore(), level: this.scoreboard.getLevel() });
      return;
    }
    
    this.emit('pieceSpawned', { piece: this.activePiece, next: this.nextPiece });
  }

  movePiece(direction) {
    if (!this.activePiece || this.paused) return;
    
    if (!this.activePiece.canMove(direction, this.gameGrid)) {
      if (direction === 'DOWN') {
        this._handlePieceReachedBottom();
      }
      return;
    }
    
    this.activePiece.move(direction);
    this.emit('pieceMoved', { piece: this.activePiece });
  }

  rotatePiece(direction) {
    if (!this.activePiece || this.paused) return;
    if (this.activePiece.rotate(direction, this.gameGrid)) {
      this.emit('pieceMoved', { piece: this.activePiece });
    }
  }

  flipPiece() {
    if (!this.activePiece || this.paused) return;
    if (this.activePiece.flip(this.gameGrid)) {
      this.emit('pieceMoved', { piece: this.activePiece });
    }
  }

  hardDrop() {
    if (!this.activePiece || this.paused) return;
    this.activePiece.drop(this.gameGrid);
    this._handlePieceReachedBottom();
  }

  swapHeldPiece() {
    if (!this.activePiece || this.paused) return;
    if (this.pieceStorage.turnUsed) return;
    
    const swapped = this.pieceStorage.store(this.activePiece);
    
    if (swapped) {
      this.activePiece = swapped;
      this.activePiece.posX = Math.floor((this.gameGrid.width - this.activePiece.shapeGeometry[0].length) / 2);
      this.activePiece.posY = 0;
    } else {
      this.activePiece = this.nextPiece;
      this.nextPiece = this._generateNextPiece();
    }
    
    this.emit('pieceSwapped', { piece: this.activePiece, held: swapped });
  }

  _handlePieceReachedBottom() {
    this.activePiece.occupyGridCells(this.gameGrid);
    this.stats.piecesPlaced += 1;
    const shapeId = this.activePiece.shapeId;
    this.stats.pieceCounts[shapeId] = (this.stats.pieceCounts[shapeId] || 0) + 1;
    this.emit('piecePlaced', { piece: this.activePiece, stats: this.stats });
    this.emit('bottomReached', { piece: this.activePiece });
    
    const cleared = this.clearFullRows();
    if (cleared > 0) {
      this.scoreboard.updateScore(cleared);
      this.emit('rowsCleared', { cleared, score: this.scoreboard.getScore(), level: this.scoreboard.getLevel() });
    }
    
    this.pieceStorage.resetTurn();
    this.spawnNewPiece();
  }

  clearFullRows() {
    return this.gameGrid.clearFullRows();
  }

  tick() {
    if (this.running && !this.paused) {
      this.movePiece('DOWN');
    }
  }

  reset() {
    this.gameGrid.clearAllRows();
    this.shapeGenerator.reset();
    this.pieceStorage.reset();
    this.scoreboard = new ScoreBoard(this.scoreboard.getLevel());
    this.activePiece = null;
    this.nextPiece = this._generateNextPiece();
    this.heldPiece = null;
    this.running = false;
    this.paused = false;
    this.stats = {
      piecesPlaced: 0,
      pieceCounts: {}
    };
    this.emit('reset');
  }

  start() {
    this.running = true;
    this.paused = false;
    this.spawnNewPiece();
    this.emit('started');
  }

  pause() {
    this.paused = true;
    this.emit('paused');
  }

  resume() {
    this.paused = false;
    this.emit('resumed');
  }
}
