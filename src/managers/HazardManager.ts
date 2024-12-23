import { Container, Sprite } from "pixi.js";
import { SerializedPositionVector2 } from "../models/PositionVector2";
import { MapTileKey } from "../models/MapKey";
import { TextureKey, TextureManager } from "./TextureManager";
import { Hazard, HazardTileType } from "../models/Hazard";

export class HazardManager {
  private static mapKeyIndex = 1;
  private static sizeOfSprite = TextureManager.SIZE_OF_SPRITE;
  private static hazardMap: Record<SerializedPositionVector2, Hazard> = {};

  /**
   * Returns the hazard at the given position, or null if no hazard exists at the given position.
   */
  public static getHazardAtPosition(position: SerializedPositionVector2): Hazard | null {
    return HazardManager.hazardMap[position] ?? null;
  }

  private static getHazardTileType(tileMap: MapTileKey[][], x: number, y: number): HazardTileType {
    return tileMap[y][x][this.mapKeyIndex] as HazardTileType;
  }

  private static getTexture(tileMap: MapTileKey[][], x: number, y: number) {
    const itemTileType = this.getHazardTileType(tileMap, x, y);
    switch (itemTileType) {
      case HazardTileType.WHIRLPOOL:
        return TextureManager.getTexture(TextureKey.HAZARD_WHIRLPOOL);

      case HazardTileType.NONE:
      default:
        throw new Error(`No texture found for ${itemTileType}`);
    }
  }

  public static buildHazardMap(tileMap: MapTileKey[][]): void {
    tileMap.forEach((mapTileKeyRow, yPosition) =>
      mapTileKeyRow.forEach((_, xPosition) => {
        const hazardType = this.getHazardTileType(tileMap, xPosition, yPosition);

        if (hazardType === HazardTileType.NONE) {
          return;
        }

        const itemMapKey: SerializedPositionVector2 = `${xPosition},${yPosition}`;
        const sprite = new Sprite({
          texture: this.getTexture(tileMap, xPosition, yPosition),
          x: this.sizeOfSprite * xPosition,
          y: this.sizeOfSprite * yPosition,
        });

        // Updating this.itemMap
        this.hazardMap[itemMapKey] = { tileType: hazardType, sprite };
      }),
    );
  }

  /**
   * Removes all sprites from the given container and places all map sprites in the container.
   *
   * NOTE: this will remove all sprites from the given layer and update it in-place.
   */
  public static updateContainerWithNewMapSprites(appContainer: Container) {
    appContainer.removeChildren();
    Object.values(this.hazardMap).forEach(({ sprite }) => appContainer.addChild(sprite));
  }
}
