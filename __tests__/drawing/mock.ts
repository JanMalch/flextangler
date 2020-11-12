export class MockContext {
  _x = 0;
  _y = 0;
  _rotation = 0;
  moveTo(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
  translate(x: number, y: number) {
    this._x += x;
    this._y += y;
  }
  rotate(rotation: number) {
    this._rotation = rotation;
  }
}

export declare interface MockContext extends CanvasRenderingContext2D {}
