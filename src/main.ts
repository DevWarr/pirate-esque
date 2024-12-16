import { Application, Container, Sprite } from "pixi.js";
import "./style.css";
import { Direction } from "./handleMovement";
import { MovingSprite } from "./MovingSprite";
import { TextureKey, TextureManager } from "./TextureManager";
import { Map, startingMapArray } from "./Map";

const app = new Application();
await TextureManager.loadSpritesheet();
await app.init({ width: 256, height: 224 });
app.renderer.view.resolution = 3;

document.getElementById("app")!.appendChild(app.canvas);

const shipRightSprite = new MovingSprite(
  Direction.DOWN_RIGHT,
  new Sprite(TextureManager.getTexture(TextureKey.SHIP_RIGHT)),
);

let isPaused = false;

document.onkeydown = (event: KeyboardEvent) => {
  if (event.key === " ") {
    isPaused = !isPaused;
  }
};

const mapLayer = new Container();
app.stage.addChild(mapLayer);

const underLayerSprites = Map.buildSpriteMap(startingMapArray);
Map.updateContainerWithNewMapSprites(mapLayer, underLayerSprites);

app.stage.addChild(shipRightSprite.sprite);

app.ticker.add(() => {
  // if (isPaused) return;
  // handleMovement(shipRightSprite, app);
});
