import { Application, Container } from "pixi.js";
import "./style.css";
import { TextureManager } from "./TextureManager";
import { Map, startingMapArray } from "./Map";
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

Map.tileMap = startingMapArray;
const underLayerSprites = Map.buildSpriteMap();
Map.updateContainerWithNewMapSprites(mapLayer, underLayerSprites);

const shipLayer = new Container();
app.stage.addChild(shipLayer);

const ship = new Ship(playerController);
ship.placeShipsInContainer(shipLayer);

app.ticker.add(() => {
  playerController.update();
  if (playerController.isPauseButtonPressed) isPaused = !isPaused;

  if (isPaused) {
    // If we're paused, no more movement
    return;
  }

  ship.update();
});
