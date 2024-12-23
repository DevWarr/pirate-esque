import { Container, Sprite } from "pixi.js";
import { Item, ItemTileType } from "../models/Item";
import { SerializedPositionVector2 } from "../models/PositionVector2";
import { MapTileKey } from "../models/MapKey";
import { TextureKey, TextureManager } from "./TextureManager";

export class ItemManager {
  private static mapKeyIndex = 2;
  private static sizeOfSprite = TextureManager.SIZE_OF_SPRITE;
  private static itemMap: Record<SerializedPositionVector2, Item> = {};

  /**
   * Returns the item at the given position, or null if no item exists at the given position.
   */
  public static getItemAtPosition(position: SerializedPositionVector2): Item | null {
    return ItemManager.itemMap[position] ?? null;
  }

  private static getItemTileType(tileMap: MapTileKey[][], x: number, y: number): ItemTileType {
    return tileMap[y][x][this.mapKeyIndex] as ItemTileType;
  }

  private static getTexture(tileMap: MapTileKey[][], x: number, y: number) {
    const itemTileType = this.getItemTileType(tileMap, x, y);
    switch (itemTileType) {
      case ItemTileType.HEALTH_BARREL:
        return TextureManager.getTexture(TextureKey.ITEM_HEALTH_BARREL);

      case ItemTileType.MAP_PIECE:
        return TextureManager.getTexture(TextureKey.ITEM_MAP_PIECE);

      case ItemTileType.SPEED_BOOST:
      case ItemTileType.NONE:
      default:
        throw new Error(`No texture found for ${itemTileType}`);
    }
  }

  public static buildItemMap(tileMap: MapTileKey[][]): void {
    tileMap.forEach((mapTileKeyRow, yPosition) =>
      mapTileKeyRow.forEach((_, xPosition) => {
        const itemType = this.getItemTileType(tileMap, xPosition, yPosition);

        if (itemType === ItemTileType.NONE) {
          return;
        }

        const itemMapKey: SerializedPositionVector2 = `${xPosition},${yPosition}`;
        const sprite = new Sprite({
          texture: this.getTexture(tileMap, xPosition, yPosition),
          x: this.sizeOfSprite * xPosition,
          y: this.sizeOfSprite * yPosition,
        });

        // Updating this.itemMap
        this.itemMap[itemMapKey] = { tileType: itemType, sprite };
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
    Object.values(this.itemMap).forEach(({ sprite }) => appContainer.addChild(sprite));
  }
}
