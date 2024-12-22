import { Container, Sprite } from "pixi.js";
import { SizeVector2 } from "../models/SizeVector2";
import { PositionVector2 } from "../models/PositionVector2";
import { TextureKey, TextureManager } from "./TextureManager";
import { Terrain, TerrainTileType } from "../models/Terrain";
import { MapTileKey } from "../models/MapKey";

export class TerrainManager {
  private static mapKeyIndex = 0;
  private static sizeOfSprite = 16;
  private static terrainMap: Terrain[][] = [[]];

  /** returns the size of the tileMap. Assumes the tileMap is a rectangle */
  public static get tileMapSize(): SizeVector2 {
    return {
      w: TerrainManager.terrainMap[0].length,
      h: TerrainManager.terrainMap.length,
    };
  }

  private static getTexture(tileMap: MapTileKey[][], x: number, y: number) {
    const terrainTileType: TerrainTileType = tileMap[y][x][TerrainManager.mapKeyIndex] as TerrainTileType;
    if (terrainTileType === TerrainTileType.WATER) {
      return TextureManager.getTexture(TextureKey.TERRAIN_WATER);
    }

    return TextureManager.getTexture(TextureKey.TERRAIN_LAND_CENTER_CENTER);
  }

  /**
   * Updates this.spriteMap with the 2D array of tiles that should exist on the map
   */
  public static buildTerrainMap(tileMap: MapTileKey[][]): void {
    this.terrainMap = tileMap.map((tileMapRow, yPosition) =>
      tileMapRow.map((_, xPosition) => {
        return {
          tileType: tileMap[yPosition][xPosition][TerrainManager.mapKeyIndex] as TerrainTileType,
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
