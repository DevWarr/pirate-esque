import { Container, Sprite } from "pixi.js";
import { SizeVector2 } from "../models/SizeVector2";
import { IPositionVector2, PositionVector2 } from "../models/PositionVector2";
import { TextureKey, TextureManager } from "./TextureManager";
import { Terrain, TerrainTileType } from "../models/Terrain";
import { MapTileKey } from "../models/MapKey";
import { MapManager } from "./MapManager";

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

/** Directions in the order of up, right, down, left (matching CSS convention) */
const CSS_ORDERED_DIRECTIONS = [PositionVector2.UP, PositionVector2.RIGHT, PositionVector2.DOWN, PositionVector2.LEFT];

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

  public static getTerrainTileTypeFromMapTileKey(mapTileKey: MapTileKey | null): TerrainTileType {
    return (mapTileKey?.[TerrainManager.mapKeyIndex] as TerrainTileType) ?? TerrainTileType.WATER;
  }

  private static getWaterTexture() {
    return TextureManager.getTexture(
      Math.random() > 0.1 ? TextureKey.TERRAIN_WATER : TextureKey.TERRAIN_WATER_WITH_WAVES,
    );
  }

  private static isPositionInBounds(tileMap: MapTileKey[][], x: number, y: number): boolean {
    return y >= 0 && y < tileMap.length && x >= 0 && x < tileMap[0].length;
  }

  private static getNeighboringMapTileKeys(
    tileMap: MapTileKey[][],
    currentTilePosition: IPositionVector2,
  ): Array<MapTileKey | null> {
    return CSS_ORDERED_DIRECTIONS.map((direction) => {
      const neighborPosition = PositionVector2.add(currentTilePosition, direction);

      // If we're in bounds, return the tile at the given position
      if (this.isPositionInBounds(tileMap, neighborPosition.x, neighborPosition.y)) {
        return tileMap[neighborPosition.y][neighborPosition.x];
      }

      // If we're out of bounds, check if there's a neighboring map section
      const neighboringTileMap: MapTileKey[][] | null = MapManager.getMapSection(
        PositionVector2.add(MapManager.currentMapPosition, direction),
      );

      // If there's no neighboring map section, return null
      if (!neighboringTileMap) {
        return null;
      }

      // Determine the position to check in the neighboring map section
      const newPositionToCheck = new PositionVector2(
        // If we're moving left (-1), we want to check the right-most tile (map width - 1) in the neighboring map section
        // If we're moving right (1), we want to check the left-most tile (0) in the neighboring map section
        // Otherwise, we want to check the same x position in the neighboring map section
        direction.x === -1 ? neighboringTileMap[0].length - 1 : direction.x === 1 ? 0 : neighborPosition.x,

        // Same logic, but for the y position
        direction.y === -1 ? neighboringTileMap.length - 1 : direction.y === 1 ? 0 : neighborPosition.y,
      );

      // If the position is in bounds, return the tile at the given position
      if (this.isPositionInBounds(neighboringTileMap, newPositionToCheck.x, newPositionToCheck.y)) {
        return neighboringTileMap[newPositionToCheck.y][newPositionToCheck.x];
      }

      // If the position is out of bounds, return null
      return null;
    });
  }

  private static getLandTexture(tileMap: MapTileKey[][], x: number, y: number) {
    const neighboringTileKeys = this.getNeighboringMapTileKeys(tileMap, { x, y });
    const tileAbove = this.getTerrainTileTypeFromMapTileKey(neighboringTileKeys[0]);
    const tileRight = this.getTerrainTileTypeFromMapTileKey(neighboringTileKeys[1]);
    const tileBelow = this.getTerrainTileTypeFromMapTileKey(neighboringTileKeys[2]);
    const tileLeft = this.getTerrainTileTypeFromMapTileKey(neighboringTileKeys[3]);

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
