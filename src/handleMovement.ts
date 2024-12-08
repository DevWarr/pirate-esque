import { Application, Bounds } from "pixi.js";
import { MovingSquare } from "./MovingSquare";

export enum Direction {
  DOWN_RIGHT,
  DOWN_LEFT,
  UP_RIGHT,
  UP_LEFT,
}

const DIRECTION_ORDER = [
  Direction.DOWN_RIGHT,
  Direction.UP_RIGHT,
  Direction.UP_LEFT,
  Direction.DOWN_LEFT,
]

export interface Vector2 {
  x: number;
  y: number;
}

const directionToTranslation: Record<Direction, Vector2> = {
  [Direction.DOWN_RIGHT]: { x: 1, y: 1 },
  [Direction.DOWN_LEFT]: { x: -1, y: 1 },
  [Direction.UP_RIGHT]: { x: 1, y: -1 },
  [Direction.UP_LEFT]: { x: -1, y: -1 },
};

const isObjectInBounds = (objectBounds: Bounds, appCanvas: DOMRect) => {
  console.log({
    objectTop: objectBounds.top,
    objectBottom: objectBounds.bottom,
    objectRight: objectBounds.right,
    objectLeft: objectBounds.left,
    canvasBottom: appCanvas.height,
    canvasLeft: 0,
    canvasTop: 0,
    canvasRight: appCanvas.width,
  })
  return (
    objectBounds.top > 0 &&
    objectBounds.bottom < appCanvas.height &&
    objectBounds.right < appCanvas.width &&
    objectBounds.left > 0
  )
}

export const handleMovement = (objectToMove: MovingSquare, app: Application) => {
  const vectorForDirection = directionToTranslation[objectToMove.directionToMove]
  objectToMove.sprite.x += vectorForDirection.x;
  objectToMove.sprite.y += vectorForDirection.y;

  if (!isObjectInBounds(objectToMove.sprite.getBounds(), app.canvas.getBoundingClientRect())) {
    const indexOfDirectionOrder = DIRECTION_ORDER.findIndex(direction => direction === objectToMove.directionToMove);
    const newDirectionIndex = (indexOfDirectionOrder + 1) % DIRECTION_ORDER.length;
    console.log({ newDirectionIndex });
    objectToMove.directionToMove = DIRECTION_ORDER[newDirectionIndex];
  }
};
