import { Sprite } from "pixi.js";

export enum ItemTileType {
  NONE = "`",
  HEALTH_BARREL = "H",
  MAP_PIECE = "M",
  SPEED_BOOST = "S",
}

export interface Item {
  sprite: Sprite;
  tileType: ItemTileType;
}
