import ShapeType from './ShapeType.js';
import { randomInt } from '../core/Random.js';

export default class ShapeGenerator {
  constructor() {
    this.nextShape = this._generateShape();
  }
  _generateShape() {
    const idx = randomInt(ShapeType.Shapes.length);
    return ShapeType[ShapeType.Shapes[idx]]();
  }
  getNextShape() {
    const shape = this.nextShape;
    this.nextShape = this._generateShape();
    return shape;
  }
  peekNext() {
    return this.nextShape;
  }
  reset() {
    this.nextShape = this._generateShape();
  }
}
