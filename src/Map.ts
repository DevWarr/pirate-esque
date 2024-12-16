import { Container, Sprite } from "pixi.js";
import { PositionVector2 } from "./gameTypes";
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

  private static getTexture(x: number, y: number, mapData: UnderLayerTileType[][]) {
    if (mapData[y][x] === "_") {
      return TextureManager.getTexture(TextureKey.WATER);
    }

    return TextureManager.getTexture(TextureKey.LAND_CENTER_CENTER);
  }

  /**
   * Takes a 2d array of UnderLayerTileType and creates sprites that can be added to the app stage.
   *
   * NOTE: This doesn't add the map to the app stage itself
   * @param mapToGenerate
   */
  public static buildSpriteMap(mapToGenerate: UnderLayerTileType[][]) {
    return mapToGenerate.map((textureIndexArray, yPosition) =>
      textureIndexArray.map((_, xPosition) => {
        const texture = this.getTexture(xPosition, yPosition, mapToGenerate);
        return new Sprite({
          texture,
          x: 16 * xPosition,
          y: 16 * yPosition,
        });
      }),
    );
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
