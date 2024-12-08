import { Texture, Sprite } from "pixi.js";
import { Direction } from "./handleMovement";

export class MovingSquare {
    constructor(
        public directionToMove: Direction,
        texture: Texture,
        public sprite = Sprite.from(texture),
    ) { }
}
