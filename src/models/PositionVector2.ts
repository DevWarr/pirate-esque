export type SerializedPositionVector2 = `${number},${number}`;

export interface IPositionVector2 {
  x: number;
  y: number;
}

export class PositionVector2 implements IPositionVector2 {
  constructor(
    private _x: number,
    private _y: number,
  ) {}

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get serializedPosition(): SerializedPositionVector2 {
    return `${this._x},${this._y}`;
  }

  static get LEFT(): PositionVector2 {
    return new PositionVector2(-1, 0);
  }

  static get RIGHT(): PositionVector2 {
    return new PositionVector2(1, 0);
  }

  static get UP(): PositionVector2 {
    return new PositionVector2(0, -1);
  }

  static get DOWN(): PositionVector2 {
    return new PositionVector2(0, 1);
  }

  static add(a: IPositionVector2, b: IPositionVector2): PositionVector2 {
    return new PositionVector2(a.x + b.x, a.y + b.y);
  }
}
