import EventEmitter from '../core/EventEmitter.js';

export default class PieceStorage extends EventEmitter {
  constructor() {
    super();
    this.storedPiece = null;
    this.turnUsed = false;
  }
  store(piece) {
    if (this.turnUsed) return null;
    const old = this.storedPiece;
    this.storedPiece = piece;
    this.turnUsed = true;
    this.emit('pieceStored', { stored: piece, swapped: old });
    return old;
  }
  retrieve() {
    return this.storedPiece;
  }
  resetTurn() {
    this.turnUsed = false;
  }
  reset() {
    this.storedPiece = null;
    this.turnUsed = false;
  }
}
