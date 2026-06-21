export default class GameSquare {
  constructor(x, y, blockHeight, blockWidth) {
    this.x = x;
    this.y = y;
    this.blockHeight = blockHeight;
    this.blockWidth = blockWidth;
    this.occupied = null;
    this.elem = document.createElement('div');
    this.elem.className = 'gameSquare';
    this.elem.style.cssText = `
      position: absolute;
      display: block;
      width: ${blockWidth}px;
      height: ${blockHeight}px;
      left: ${x * blockWidth}px;
      top: ${y * blockHeight}px;
      box-sizing: border-box;
    `;

    this.blockElem = document.createElement('div');
    this.blockElem.style.cssText = `
      position: absolute;
      width: ${blockWidth - 4}px;
      height: ${blockHeight - 4}px;
      left: 2px;
      top: 2px;
      border: 3px outset #333;
      border-radius: 5px;
      box-sizing: border-box;
      display: none;
    `;
    this.elem.appendChild(this.blockElem);
  }
  fillWithBlock(block) {
    this.occupied = block;
    this.elem.style.backgroundColor = 'transparent';
    this.blockElem.style.backgroundColor = block.getColor();
    this.blockElem.style.display = 'block';
  }
  empty() {
    this.occupied = null;
    this.elem.style.backgroundColor = 'transparent';
    this.blockElem.style.display = 'none';
  }
  highlight() {
    this.elem.style.opacity = '0.5';
  }
  unhighlight() {
    this.elem.style.opacity = '1';
  }
  getElement() { return this.elem; }
}
