import { Sprite } from "pixi.js";

export enum TerrainTileType {
  WATER = "_",
  LAND = "0",
}

export interface Terrain {
  sprite: Sprite;
  tileType: TerrainTileType;
}
