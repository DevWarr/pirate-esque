import { Sprite } from "pixi.js";

export enum HazardTileType {
  NONE = "-",
  WHIRLPOOL = "W",
}

export interface Hazard {
  sprite: Sprite;
  tileType: HazardTileType;
}
