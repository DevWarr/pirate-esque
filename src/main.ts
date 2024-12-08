import { Application, Sprite, Texture } from "pixi.js";
import "./style.css";
import { Direction, handleMovement } from "./handleMovement";
import { MovingSquare } from "./MovingSquare";

console.log("hello world");
const app = new Application();
await app.init();

document.getElementById("app")!.appendChild(app.canvas);

const background = Sprite.from(Texture.WHITE);
background.width = app.canvas.width;
background.height = app.canvas.height;
background.tint = 0x6666ff;

const square = new MovingSquare(Direction.DOWN_RIGHT, Texture.WHITE)
square.sprite.width = 25;
square.sprite.height = 25;
square.sprite.tint = 0xff0000;
square.sprite.x = app.renderer.width * 0.5;
square.sprite.y = app.renderer.height * 0.5;
square.sprite.anchor.x = square.sprite.anchor.y = 0.5;

let isPaused = false

document.onkeydown = (event: KeyboardEvent) => {
    if (event.key === " ") {
        isPaused = !isPaused;
    }
}

app.stage.addChild(background);
app.stage.addChild(square.sprite);

app.ticker.add(() => {
    if (isPaused) return;

    handleMovement(square, app);
})
