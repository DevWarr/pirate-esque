import { Application, Container, Sprite, Texture } from "pixi.js";
import "./style.css";
import { TextureManager } from "./TextureManager";
import { TerrainManager, startingMapArray } from "./managers/TerrainManager";
import { Controller } from "./controllers/Controller";
import { Ship } from "./Ship";

const app = new Application();
await TextureManager.loadSpritesheet();
await app.init({ width: 320, height: 240 });
app.renderer.view.resolution = 3;

document.getElementById("app")!.appendChild(app.canvas);

let isPaused = false;
const playerController = new Controller();

const mapLayer = new Container();
app.stage.addChild(mapLayer);

TerrainManager.buildSpriteMapFromMapTiles(startingMapArray);
TerrainManager.updateContainerWithNewMapSprites(mapLayer);

const shipLayer = new Container();
app.stage.addChild(shipLayer);

const ship = new Ship(playerController);
ship.placeShipInContainer(shipLayer);

const pauseLayer = new Container();
app.stage.addChild(pauseLayer);
const foreground = new Sprite(Texture.WHITE);
foreground.width = app.canvas.width;
foreground.height = app.canvas.height;
foreground.tint = 0x000000;
foreground.alpha = 0.4;
foreground.visible = false;
pauseLayer.addChild(foreground);

app.ticker.add(() => {
  playerController.update();
  if (playerController.isPauseButtonPressed) {
    isPaused = !isPaused;
    foreground.visible = isPaused;
  }

  if (isPaused) {
    // If we're paused, no more movement
    return;
  }

  ship.update();
});
