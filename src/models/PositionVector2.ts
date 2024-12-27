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

  public add({ x, y }: IPositionVector2): PositionVector2 {
    return new PositionVector2(this._x + x, this._y + y);
  }

  static add(a: IPositionVector2, b: IPositionVector2): PositionVector2 {
    return new PositionVector2(a.x + b.x, a.y + b.y);
  }

  public subtract({ x, y }: IPositionVector2): PositionVector2 {
    return new PositionVector2(this._x - x, this._y - y);
  }

  public static subtract(a: IPositionVector2, b: IPositionVector2): PositionVector2 {
    return new PositionVector2(a.x - b.x, a.y - b.y);
  }

  public isEqualTo({ x, y }: IPositionVector2): boolean {
    return this._x === x && this._y === y;
  }

  public static fromSerializedPosition(serializedPosition: SerializedPositionVector2): PositionVector2 {
    const [x, y] = serializedPosition.split(",").map(Number);
    return new PositionVector2(x, y);
  }

  public static from({ x, y }: IPositionVector2): PositionVector2 {
    return new PositionVector2(x, y);
  }
}

/** Directions in the order of up, right, down, left (matching CSS convention) */
export const CSS_ORDERED_DIRECTIONS = [
  PositionVector2.UP,
  PositionVector2.RIGHT,
  PositionVector2.DOWN,
  PositionVector2.LEFT,
];
export type ValidDirection = (typeof CSS_ORDERED_DIRECTIONS)[number];
