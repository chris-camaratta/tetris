import Shape from './Shape.js';

const ShapeType = {
  Shapes: ['CUBE', 'LINE', 'ELBOW1', 'ELBOW2', 'ZIGZAG1', 'ZIGZAG2', 'TEE'],
  CUBE: () => new Shape(0, [[1,1],[1,1]], 'yellow'),
  LINE: () => new Shape(1, [[1,1,1,1]], 'red'),
  ELBOW1: () => new Shape(2, [[1,1,1],[1,0,0]], 'blue'),
  ELBOW2: () => new Shape(3, [[1,0,0],[1,1,1]], 'BlueViolet'),
  ZIGZAG1: () => new Shape(4, [[1,1,0],[0,1,1]], 'green'),
  ZIGZAG2: () => new Shape(5, [[0,1,1],[1,1,0]], 'RosyBrown'),
  TEE: () => new Shape(6, [[0,1,0],[1,1,1]], 'orange')
};

export default ShapeType;
