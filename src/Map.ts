import { Container, Sprite } from "pixi.js";
import { PositionVector2, SizeVector2 } from "./gameTypes";
import { TextureKey, TextureManager } from "./TextureManager";

/**
 * A type to easily detect water vs land.
 *
 * For better human-readibility, water is `"_"` and land is `"M"`.
 */
type UnderLayerTileType = "_" | "M";

export const startingMapArray: UnderLayerTileType[][] = [
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "M", "M", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "M", "M", "M", "M", "M", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "M", "M", "M", "M", "M", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "M", "M", "M", "M", "M", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "M", "M", "M", "M", "M", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "M", "M", "M", "M", "M", "M", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "M", "M", "M", "_", "_", "M", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
  ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
];

export class Map {
  public static shipLocation: PositionVector2 = { x: 0, y: 0 };

  public static tileMap: UnderLayerTileType[][] = [[]];

  /** returns the size of the tileMap. Assumes the tileMap is a rectangle */
  public static get tileMapSize(): SizeVector2 {
    return {
      w: Map.tileMap[0].length,
      h: Map.tileMap.length,
    };
  }

  private static getTexture(x: number, y: number) {
    if (this.tileMap[y][x] === "_") {
      return TextureManager.getTexture(TextureKey.WATER);
    }

    return TextureManager.getTexture(TextureKey.LAND_CENTER_CENTER);
  }

  /**
   * Takes a 2d array of UnderLayerTileType and creates sprites that can be added to the app stage.
   *
   * NOTES:
   *
   * - This doesn't add the sprite 2d array to any containers
   * - this.tileMap must be set first!
   * @param mapToGenerate
   */
  public static buildSpriteMap(): Sprite[][] {
    return this.tileMap.map((textureIndexArray, yPosition) =>
      textureIndexArray.map((_, xPosition) => {
        const texture = this.getTexture(xPosition, yPosition);
        return new Sprite({
          texture,
          x: 16 * xPosition,
          y: 16 * yPosition,
        });
      }),
    );
  }

  public static isLand(position: PositionVector2): boolean {
    return Map.tileMap[position.y][position.x] === "M";
  }

  /**
   * Removes all sprites from the given container and places all map sprites in the container.
   *
   * NOTE: this will remove all sprites from the given layer and update it in-place.
   */
  public static updateContainerWithNewMapSprites(appContainer: Container, newMapSprites: Sprite[][]) {
    appContainer.removeChildren();
    newMapSprites.forEach((spriteArray) => spriteArray.forEach((sprite) => appContainer.addChild(sprite)));
  }
}
