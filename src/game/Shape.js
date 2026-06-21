export default class Shape {
  constructor(id, geometryGrid, color) {
    this.id = id;
    this.geometryGrid = geometryGrid;
    this.color = color;
  }
  getGeometry() { return this.geometryGrid; }
  getColor() { return this.color; }
  getId() { return this.id; }
}
