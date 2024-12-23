import { Container, Sprite, Text, Texture } from "pixi.js";

export class HudLayer {
  private static healthText: Text;
  private static healthOutline: Sprite;
  private static healthBackground: Sprite;
  private static healthBar: Sprite;
  private static MAX_HEALTH = 100;

  public static buildHudLayer() {
    this.healthText = new Text({ text: "Health:", style: { fill: 0xffffff, fontSize: 8, fontFamily: "monospace" } });
    this.healthText.x = 8;
    this.healthText.y = 5;

    this.healthOutline = new Sprite(Texture.WHITE);
    this.healthOutline.width = HudLayer.MAX_HEALTH + 2;
    this.healthOutline.height = 10;
    this.healthOutline.tint = 0xffffff;
    this.healthOutline.x = 8;
    this.healthOutline.y = 16;

    this.healthBackground = new Sprite(Texture.WHITE);
    this.healthBackground.width = HudLayer.MAX_HEALTH;
    this.healthBackground.height = 8;
    this.healthBackground.tint = 0x000000;
    this.healthBackground.x = 9;
    this.healthBackground.y = 17;

    this.healthBar = new Sprite(Texture.WHITE);
    this.healthBar.width = HudLayer.MAX_HEALTH;
    this.healthBar.height = 8;
    this.healthBar.tint = 0xff0000;
    this.healthBar.x = 9;
    this.healthBar.y = 17;
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
