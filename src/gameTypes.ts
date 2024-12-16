export interface PositionVector2 {
  x: number;
  y: number;
}

export interface SizeVector2 {
  w: number;
  h: number;
}

export interface PositionAndSizeVector extends PositionVector2, SizeVector2 {}
