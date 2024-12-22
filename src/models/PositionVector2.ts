export type SerializedPositionVector2 = `${number},${number}`;

export class PositionVector2 {
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
}
