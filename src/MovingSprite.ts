import { Sprite } from "pixi.js";
import { Direction } from "./handleMovement";

export class MovingSprite {
    constructor(
        public directionToMove: Direction,
        public sprite: Sprite,
    ) { }
}
