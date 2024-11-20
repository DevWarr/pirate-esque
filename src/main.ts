import { Application, Sprite, Texture } from "pixi.js";
import "./style.css";
import { handleMovement } from "./handleMovement";

console.log("hello world");
const app = new Application();
await app.init();

document.getElementById("app")!.appendChild(app.canvas);

const background = Sprite.from(Texture.WHITE);
background.width = app.canvas.width;
background.height = app.canvas.height;
background.tint = 0x6666ff;

const square = Sprite.from(Texture.WHITE)
square.width = 25;
square.height = 25;
square.tint = 0xff0000;
square.x = app.renderer.width * 0.5;
square.y = app.renderer.height * 0.5;
square.anchor.x = square.anchor.y = 0.5;

app.stage.addChild(background);
app.stage.addChild(square);

app.ticker.add(() => {
    handleMovement(square, app);
})
