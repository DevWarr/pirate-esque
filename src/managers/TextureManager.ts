import { Assets, Spritesheet, Texture } from "pixi.js";

export enum TextureKey {
  // Terrain
  TERRAIN_LAND_TOP_LEFT = "TERRAIN_LAND_TOP_LEFT",
  TERRAIN_LAND_TOP_CENTER = "TERRAIN_LAND_TOP_CENTER",
  TERRAIN_LAND_TOP_RIGHT = "TERRAIN_LAND_TOP_RIGHT",
  TERRAIN_LAND_CENTER_LEFT = "TERRAIN_LAND_CENTER_LEFT",
  TERRAIN_LAND_CENTER_CENTER = "TERRAIN_LAND_CENTER_CENTER",
  TERRAIN_LAND_CENTER_RIGHT = "TERRAIN_LAND_CENTER_RIGHT",
  TERRAIN_LAND_BOTTOM_LEFT = "TERRAIN_LAND_BOTTOM_LEFT",
  TERRAIN_LAND_BOTTOM_CENTER = "TERRAIN_LAND_BOTTOM_CENTER",
  TERRAIN_LAND_BOTTOM_RIGHT = "TERRAIN_LAND_BOTTOM_RIGHT",
  TERRAIN_LAND_PENINSULA_LEFT = "TERRAIN_LAND_PENINSULA_LEFT",
  TERRAIN_LAND_PENINSULA_TOP = "TERRAIN_LAND_PENINSULA_TOP",
  TERRAIN_LAND_PENINSULA_RIGHT = "TERRAIN_LAND_PENINSULA_RIGHT",
  TERRAIN_LAND_PENINSULA_BOTTOM = "TERRAIN_LAND_PENINSULA_BOTTOM",
  TERRAIN_WATER = "TERRAIN_WATER",
  TERRAIN_WATER_WITH_WAVES = "TERRAIN_WATER_WITH_WAVES",
  TERRAIN_WATER_WITH_BORDERS = "TERRAIN_WATER_WITH_BORDERS",

  // Ship
  SHIP_RIGHT = "SHIP_RIGHT",
  SHIP_LEFT = "SHIP_LEFT",
  SHIP_DOWN = "SHIP_DOWN",
  SHIP_UP = "SHIP_UP",

  // Hazards
  HAZARD_WHIRLPOOL = "HAZARD_WHIRLPOOL",

  // Items
  ITEM_HEALTH_BARREL = "ITEM_HEALTH_BARREL",
  ITEM_MAP_PIECE = "ITEM_MAP_PIECE",
}

export class TextureManager {
  public static readonly SIZE_OF_SPRITE = 16;
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
      [TextureKey.TERRAIN_LAND_TOP_LEFT]: spritesheet.textures["spritesheet_layer-land-top-left_frame-0"],
      [TextureKey.TERRAIN_LAND_TOP_CENTER]: spritesheet.textures["spritesheet_layer-land-top-center_frame-0"],
      [TextureKey.TERRAIN_LAND_TOP_RIGHT]: spritesheet.textures["spritesheet_layer-land-top-right_frame-0"],
      [TextureKey.TERRAIN_LAND_CENTER_LEFT]: spritesheet.textures["spritesheet_layer-land-center-left_frame-0"],
      [TextureKey.TERRAIN_LAND_CENTER_CENTER]: spritesheet.textures["spritesheet_layer-land-center-center_frame-0"],
      [TextureKey.TERRAIN_LAND_CENTER_RIGHT]: spritesheet.textures["spritesheet_layer-land-center-right_frame-0"],
      [TextureKey.TERRAIN_LAND_BOTTOM_LEFT]: spritesheet.textures["spritesheet_layer-land-bottom-left_frame-0"],
      [TextureKey.TERRAIN_LAND_BOTTOM_CENTER]: spritesheet.textures["spritesheet_layer-land-bottom-center_frame-0"],
      [TextureKey.TERRAIN_LAND_BOTTOM_RIGHT]: spritesheet.textures["spritesheet_layer-land-bottom-right_frame-0"],
      [TextureKey.TERRAIN_WATER]: spritesheet.textures["spritesheet_layer-water_frame-0"],
      [TextureKey.TERRAIN_WATER_WITH_BORDERS]: spritesheet.textures["spritesheet_layer-water-with-borders_frame-0"],
      [TextureKey.TERRAIN_WATER_WITH_WAVES]: spritesheet.textures["spritesheet_layer-water-with-waves_frame-0"],
      [TextureKey.TERRAIN_LAND_PENINSULA_LEFT]: spritesheet.textures["spritesheet_layer-land-peninsula-left_frame-0"],
      [TextureKey.TERRAIN_LAND_PENINSULA_TOP]: spritesheet.textures["spritesheet_layer-land-peninsula-top_frame-0"],
      [TextureKey.TERRAIN_LAND_PENINSULA_RIGHT]: spritesheet.textures["spritesheet_layer-land-peninsula-right_frame-0"],
      [TextureKey.TERRAIN_LAND_PENINSULA_BOTTOM]:
        spritesheet.textures["spritesheet_layer-land-peninsula-bottom_frame-0"],
      // Ship textures
      [TextureKey.SHIP_RIGHT]: spritesheet.textures["spritesheet_layer-boat-right_frame-0"],
      [TextureKey.SHIP_LEFT]: spritesheet.textures["spritesheet_layer-boat-left_frame-0"],
      [TextureKey.SHIP_UP]: spritesheet.textures["spritesheet_layer-boat-up_frame-0"],
      [TextureKey.SHIP_DOWN]: spritesheet.textures["spritesheet_layer-boat-down_frame-0"],
      // Hazard textures
      [TextureKey.HAZARD_WHIRLPOOL]: spritesheet.textures["spritesheet_layer-whirlpool_frame-0"],
      // Item
      [TextureKey.ITEM_HEALTH_BARREL]: spritesheet.textures["spritesheet_layer-health-barrel_frame-0"],
      [TextureKey.ITEM_MAP_PIECE]: spritesheet.textures["spritesheet_layer-map-piece_frame-0"],
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
