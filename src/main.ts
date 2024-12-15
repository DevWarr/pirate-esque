import {
  Application,
  Assets,
  Container,
  Sprite,
  Spritesheet,
  Texture,
} from "pixi.js";
import "./style.css";
import { Direction } from "./handleMovement";
import { MovingSprite } from "./MovingSprite";

const app = new Application();
await app.init({ width: 256, height: 256 });
app.renderer.view.resolution = 4;

document.getElementById("app")!.appendChild(app.canvas);

const firstMap = [
  [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
  [9, 0, 1, 1, 1, 1, 1, 2, 9, 9],
  [9, 3, 4, 4, 4, 4, 4, 5, 9, 9],
  [9, 6, 7, 4, 4, 4, 4, 5, 9, 9],
  [9, 9, 9, 3, 4, 4, 7, 8, 9, 9],
  [9, 9, 9, 6, 7, 8, 9, 9, 9, 9],
  [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
];

const spriteSheet: Spritesheet = await Assets.load(
  "../assets/sprites/spritesheet_updated.json",
);

const underLayerTextures = [
  spriteSheet.textures["spritesheet_layer-land-top-left_frame-0"],
  spriteSheet.textures["spritesheet_layer-land-top-center_frame-0"],
  spriteSheet.textures["spritesheet_layer-land-top-right_frame-0"],
  spriteSheet.textures["spritesheet_layer-land-center-left_frame-0"],
  spriteSheet.textures["spritesheet_layer-land-center-center_frame-0"],
  spriteSheet.textures["spritesheet_layer-land-center-right_frame-0"],
  spriteSheet.textures["spritesheet_layer-land-bottom-left_frame-0"],
  spriteSheet.textures["spritesheet_layer-land-bottom-center_frame-0"],
  spriteSheet.textures["spritesheet_layer-land-bottom-right_frame-0"],
  spriteSheet.textures["spritesheet_layer-water_frame-0"],
];

const background = Sprite.from(Texture.WHITE);
background.width = app.canvas.width;
background.height = app.canvas.height;
background.tint = 0x6666ff;
console.log({ background });

const shipRightTexture =
  spriteSheet.textures["spritesheet_layer-boat-right_frame-0"];

const shipRightSprite = new MovingSprite(
  Direction.DOWN_RIGHT,
  new Sprite(shipRightTexture),
);

let isPaused = false;

document.onkeydown = (event: KeyboardEvent) => {
  if (event.key === " ") {
    isPaused = !isPaused;
  }
};

const underLayer = new Container();
app.stage.addChild(underLayer);

const underLayerSprites = firstMap.map((textureIndexArray, yMultiple) =>
  textureIndexArray.map((textureIndex, xMultiple) => {
    const texture = underLayerTextures[textureIndex];
    texture.source.scaleMode = "nearest";
    const underLayerSprite = new Sprite(texture);
    underLayerSprite.position.set(16 * xMultiple, 16 * yMultiple);
    console.log({
      yMultiple,
      xMultiple,
      x: underLayerSprite.x,
      y: underLayerSprite.y,
      textureIndex,
    });
    return underLayerSprite;
  }),
);

underLayerSprites.forEach((spriteArray) =>
  spriteArray.forEach((sprite) => underLayer.addChild(sprite)),
);

app.stage.addChild(shipRightSprite.sprite);

app.ticker.add(() => {
  // if (isPaused) return;
  // handleMovement(shipRightSprite, app);
});
