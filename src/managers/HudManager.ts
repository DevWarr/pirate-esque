import { Container, Sprite, Text, Texture } from "pixi.js";
import { TextureManager } from "./TextureManager";

export class HudLayer {
  private static healthText: Text;
  private static healthOutline: Sprite;
  private static healthBackground: Sprite;
  private static healthBar: Sprite;
  private static MAX_HEALTH = 200;

  public static buildHudLayer() {
    this.healthText = new Text({
      text: "Health:",
      style: {
        fill: 0xffffff,
        fontSize: TextureManager.SIZE_OF_SPRITE / 2,
        fontFamily: "monospace",
      },
    });
    this.healthText.x = TextureManager.SIZE_OF_SPRITE / 2;
    this.healthText.y = Math.floor(TextureManager.SIZE_OF_SPRITE / 3);

    this.healthOutline = new Sprite(Texture.WHITE);
    this.healthOutline.width = HudLayer.MAX_HEALTH + 4;
    this.healthOutline.height = TextureManager.SIZE_OF_SPRITE / 2 + 4;
    this.healthOutline.tint = 0xffffff;
    this.healthOutline.x = TextureManager.SIZE_OF_SPRITE / 2;
    this.healthOutline.y = TextureManager.SIZE_OF_SPRITE;

    this.healthBackground = new Sprite(Texture.WHITE);
    this.healthBackground.width = HudLayer.MAX_HEALTH;
    this.healthBackground.height = TextureManager.SIZE_OF_SPRITE / 2;
    this.healthBackground.tint = 0x000000;
    this.healthBackground.x = TextureManager.SIZE_OF_SPRITE / 2 + 2;
    this.healthBackground.y = TextureManager.SIZE_OF_SPRITE + 2;

    this.healthBar = new Sprite(Texture.WHITE);
    this.healthBar.width = HudLayer.MAX_HEALTH;
    this.healthBar.height = TextureManager.SIZE_OF_SPRITE / 2;
    this.healthBar.tint = 0xff0000;
    this.healthBar.x = TextureManager.SIZE_OF_SPRITE / 2 + 2;
    this.healthBar.y = TextureManager.SIZE_OF_SPRITE + 2;
  }

  public static addSpritesToHudLayer(hudLayer: Container) {
    hudLayer.addChild(this.healthText);
    hudLayer.addChild(this.healthOutline);
    hudLayer.addChild(this.healthBackground);
    hudLayer.addChild(this.healthBar);
  }

  public static get health() {
    return HudLayer.healthBar.width;
  }

  public static set health(newHealth: number) {
    if (newHealth <= 0) {
      HudLayer.healthBar.width = 0;
    } else if (newHealth > HudLayer.MAX_HEALTH) {
      HudLayer.healthBar.width = HudLayer.MAX_HEALTH;
    } else {
      HudLayer.healthBar.width = newHealth;
    }
  }
}
