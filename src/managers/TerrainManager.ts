import { Container, Sprite } from "pixi.js";
import { SizeVector2 } from "../models/SizeVector2";
import { PositionVector2 } from "../models/PositionVector2";
import { TextureKey, TextureManager } from "./TextureManager";
import { Terrain, TerrainTileType } from "../models/Terrain";
import { MapTileKey } from "../models/MapKey";

// Top, right, bottom, left
const landMap: Record<`${TerrainTileType},${TerrainTileType},${TerrainTileType},${TerrainTileType}`, TextureKey> = {
  "_,_,0,0": TextureKey.TERRAIN_LAND_TOP_RIGHT,
  "_,0,0,0": TextureKey.TERRAIN_LAND_TOP_CENTER,
  "_,0,0,_": TextureKey.TERRAIN_LAND_TOP_LEFT,
  "0,0,0,_": TextureKey.TERRAIN_LAND_CENTER_LEFT,
  "0,0,0,0": TextureKey.TERRAIN_LAND_CENTER_CENTER,
  "0,_,0,0": TextureKey.TERRAIN_LAND_CENTER_RIGHT,
  "0,0,_,_": TextureKey.TERRAIN_LAND_BOTTOM_LEFT,
  "0,0,_,0": TextureKey.TERRAIN_LAND_BOTTOM_CENTER,
  "0,_,_,0": TextureKey.TERRAIN_LAND_BOTTOM_RIGHT,
  "0,_,_,_": TextureKey.TERRAIN_LAND_PENINSULA_BOTTOM,
  "_,0,_,_": TextureKey.TERRAIN_LAND_PENINSULA_LEFT,
  "_,_,0,_": TextureKey.TERRAIN_LAND_PENINSULA_TOP,
  "_,_,_,0": TextureKey.TERRAIN_LAND_PENINSULA_RIGHT,
  "0,_,0,_": TextureKey.TERRAIN_LAND_CENTER_CENTER, // We don't have a texture for this, so we'll just use the center texture
  "_,0,_,0": TextureKey.TERRAIN_LAND_CENTER_CENTER, // We don't have a texture for this, so we'll just use the center texture
  "_,_,_,_": TextureKey.TERRAIN_LAND_CENTER_CENTER, // We don't have a texture for this, so we'll just use the center texture
};

export class TerrainManager {
  private static mapKeyIndex = 0;
  private static sizeOfSprite = TextureManager.SIZE_OF_SPRITE;
  private static terrainMap: Terrain[][] = [[]];

  /** returns the size of the tileMap. Assumes the tileMap is a rectangle */
  public static get tileMapSize(): SizeVector2 {
    return {
      w: TerrainManager.terrainMap[0].length,
      h: TerrainManager.terrainMap.length,
    };
  }

  /**
   * Returns the terrain tile type at the given x, y position.
   *
   * If no tile exists at the given position, it will return `TerrainTileType.WATER`
   */
  private static getTerrainTileType(tileMap: MapTileKey[][], x: number, y: number): TerrainTileType {
    return (tileMap[y]?.[x]?.[TerrainManager.mapKeyIndex] as TerrainTileType) ?? TerrainTileType.WATER;
  }

  private static getWaterTexture() {
    return TextureManager.getTexture(
      Math.random() > 0.1 ? TextureKey.TERRAIN_WATER : TextureKey.TERRAIN_WATER_WITH_WAVES,
    );
  }

  private static getLandTexture(tileMap: MapTileKey[][], x: number, y: number) {
    const tileAbove = this.getTerrainTileType(tileMap, x, y - 1);
    const tileBelow = this.getTerrainTileType(tileMap, x, y + 1);
    const tileLeft = this.getTerrainTileType(tileMap, x - 1, y);
    const tileRight = this.getTerrainTileType(tileMap, x + 1, y);

    return landMap[`${tileAbove},${tileRight},${tileBelow},${tileLeft}`];
  }

  private static getTexture(tileMap: MapTileKey[][], x: number, y: number) {
    const terrainTileType: TerrainTileType = this.getTerrainTileType(tileMap, x, y);
    if (terrainTileType === TerrainTileType.WATER) {
      return this.getWaterTexture();
    }

    return TextureManager.getTexture(this.getLandTexture(tileMap, x, y));
  }

  /**
   * Updates this.spriteMap with the 2D array of tiles that should exist on the map
   */
  public static buildTerrainMap(tileMap: MapTileKey[][]): void {
    this.terrainMap = tileMap.map((tileMapRow, yPosition) =>
      tileMapRow.map((_, xPosition) => {
        return {
          tileType: this.getTerrainTileType(tileMap, xPosition, yPosition),
          sprite: new Sprite({
            texture: this.getTexture(tileMap, xPosition, yPosition),
            x: this.sizeOfSprite * xPosition,
            y: this.sizeOfSprite * yPosition,
          }),
        };
      }),
    );
  }

  public static isLand(position: PositionVector2): boolean {
    return TerrainManager.terrainMap[position.y][position.x].tileType === TerrainTileType.LAND;
  }

  /**
   * Removes all sprites from the given container and places all map sprites in the container.
   *
   * NOTE: this will remove all sprites from the given layer and update it in-place.
   */
  public static updateContainerWithNewMapSprites(appContainer: Container) {
    appContainer.removeChildren();
    this.terrainMap.forEach((terrainRow) => terrainRow.forEach(({ sprite }) => appContainer.addChild(sprite)));
  }
}
