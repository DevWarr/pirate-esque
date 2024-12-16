import { Assets, Spritesheet, Texture } from "pixi.js";

export enum TextureKey {
  LAND_TOP_LEFT = "LAND_TOP_LEFT",
  LAND_TOP_CENTER = "LAND_TOP_CENTER",
  LAND_TOP_RIGHT = "LAND_TOP_RIGHT",
  LAND_CENTER_LEFT = "LAND_CENTER_LEFT",
  LAND_CENTER_CENTER = "LAND_CENTER_CENTER",
  LAND_CENTER_RIGHT = "LAND_CENTER_RIGHT",
  LAND_BOTTOM_LEFT = "LAND_BOTTOM_LEFT",
  LAND_BOTTOM_CENTER = "LAND_BOTTOM_CENTER",
  LAND_BOTTOM_RIGHT = "LAND_BOTTOM_RIGHT",
  WATER = "WATER",
  SHIP_RIGHT = "SHIP_RIGHT",
  SHIP_LEFT = "SHIP_LEFT",
  SHIP_DOWN = "SHIP_DOWN",
  SHIP_UP = "SHIP_UP",
}

export class TextureManager {
  private static textures: Record<string, Texture> = {};

  /**
   * Loads the spritesheet into memory, and assigns the textures to this.textures.
   *
   * You can access textures with the proper `TextureKey`
   *
   * @see {@link TextureKey}
   */
  public static async loadSpritesheet(): Promise<void> {
    const spritesheet: Spritesheet = await Assets.load("../assets/sprites/spritesheet_updated.json");

    // Ensures any scaling of the game still gives a pixel-perfect appearance
    spritesheet.textureSource.scaleMode = "nearest";

    this.textures = {
      // Underlayer tiles (water and land)
      [TextureKey.LAND_TOP_LEFT]: spritesheet.textures["spritesheet_layer-land-top-left_frame-0"],
      [TextureKey.LAND_TOP_CENTER]: spritesheet.textures["spritesheet_layer-land-top-center_frame-0"],
      [TextureKey.LAND_TOP_RIGHT]: spritesheet.textures["spritesheet_layer-land-top-right_frame-0"],
      [TextureKey.LAND_CENTER_LEFT]: spritesheet.textures["spritesheet_layer-land-center-left_frame-0"],
      [TextureKey.LAND_CENTER_CENTER]: spritesheet.textures["spritesheet_layer-land-center-center_frame-0"],
      [TextureKey.LAND_CENTER_RIGHT]: spritesheet.textures["spritesheet_layer-land-center-right_frame-0"],
      [TextureKey.LAND_BOTTOM_LEFT]: spritesheet.textures["spritesheet_layer-land-bottom-left_frame-0"],
      [TextureKey.LAND_BOTTOM_CENTER]: spritesheet.textures["spritesheet_layer-land-bottom-center_frame-0"],
      [TextureKey.LAND_BOTTOM_RIGHT]: spritesheet.textures["spritesheet_layer-land-bottom-right_frame-0"],
      [TextureKey.WATER]: spritesheet.textures["spritesheet_layer-water_frame-0"],
      // Ship textures
      [TextureKey.SHIP_RIGHT]: spritesheet.textures["spritesheet_layer-boat-right_frame-0"],
      [TextureKey.SHIP_LEFT]: spritesheet.textures["spritesheet_layer-boat-left_frame-0"],
      [TextureKey.SHIP_UP]: spritesheet.textures["spritesheet_layer-boat-up_frame-0"],
      [TextureKey.SHIP_DOWN]: spritesheet.textures["spritesheet_layer-boat-down_frame-0"],
    };
  }

  public static getTexture(key: TextureKey): Texture {
    if (Object.keys(this.textures).length === 0) {
      throw new Error("Textures not initialized! Call loadSpritesheet first.");
    }

    if (!this.textures[key]) {
      throw new Error(`No key found: ${key}`);
    }

    return this.textures[key];
  }
}
