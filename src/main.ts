import { Application, Container, Sprite, Texture } from "pixi.js";
import "./style.css";
import { TextureManager } from "./managers/TextureManager";
import { TerrainManager } from "./managers/TerrainManager";
import { Controller } from "./controllers/Controller";
import { Ship } from "./Ship";
import { ItemManager } from "./managers/ItemManager";
import { HazardManager } from "./managers/HazardManager";
import { mapSection_0_0 } from "./mapLayout";
import { HudLayer } from "./managers/HudManager";
import { MapManager } from "./managers/MapManager";

const app = new Application();
await TextureManager.loadSpritesheet();
await app.init({ width: 320, height: 240 + 32 });
app.renderer.view.resolution = 3;
document.getElementById("app")!.appendChild(app.canvas);

const gameLayer = new Container();
gameLayer.y = 32;
app.stage.addChild(gameLayer);

const mapLayer = new Container();
gameLayer.addChild(mapLayer);
TerrainManager.pixiContainer = mapLayer;
TerrainManager.buildTerrainMap(MapManager.currentMapSection);
TerrainManager.updateContainerWithNewMapSprites();

const hazardLayer = new Container();
gameLayer.addChild(hazardLayer);
HazardManager.pixiContainer = hazardLayer;
HazardManager.buildHazardMap(MapManager.currentMapSection);
HazardManager.updateContainerWithNewMapSprites();

const itemLayer = new Container();
gameLayer.addChild(itemLayer);
ItemManager.pixiContainer = itemLayer;
ItemManager.buildItemMap(MapManager.currentMapSection);
ItemManager.updateContainerWithNewMapSprites();

const shipLayer = new Container();
gameLayer.addChild(shipLayer);
const playerController = new Controller();
const ship = new Ship(playerController);
ship.placeShipInContainer(shipLayer);

const hudLayer = new Container();
hudLayer.height = 32;
app.stage.addChild(hudLayer);
const hudBackground = new Sprite(Texture.WHITE);
hudBackground.width = app.canvas.width;
hudBackground.height = 32;
hudBackground.tint = 0x000000;
hudBackground.alpha = 1;
hudBackground.visible = true;
hudLayer.addChild(hudBackground);
HudLayer.buildHudLayer();
HudLayer.addSpritesToHudLayer(hudLayer);

const pauseLayer = new Container();
app.stage.addChild(pauseLayer);
let isPaused = false;
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
  HudLayer.health = ship.shipHealth;
});
