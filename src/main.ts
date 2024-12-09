import { Application, Assets, Sprite, Spritesheet, Texture } from "pixi.js";
import "./style.css";
import { Direction, handleMovement } from "./handleMovement";
import { MovingSprite } from "./MovingSprite";

console.log("hello world");
const app = new Application();
await app.init();

document.getElementById("app")!.appendChild(app.canvas);

const spriteSheet: Spritesheet = await Assets.load("../assets/sprites/spritesheet_updated.json");

const background = Sprite.from(Texture.WHITE);
background.width = app.canvas.width;
background.height = app.canvas.height;
background.tint = 0x6666ff;

const shipRightTexture = spriteSheet.textures["spritesheet_layer-boat-right_frame-0"];

const shipRightSprite = new MovingSprite(Direction.DOWN_RIGHT, new Sprite(shipRightTexture))

let isPaused = false

document.onkeydown = (event: KeyboardEvent) => {
    if (event.key === " ") {
        isPaused = !isPaused;
    }
}

app.stage.addChild(background);
app.stage.addChild(shipRightSprite.sprite);

app.ticker.add(() => {
    if (isPaused) return;

    handleMovement(shipRightSprite, app);
})
