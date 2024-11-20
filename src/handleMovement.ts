import { Application, Bounds, Sprite } from "pixi.js";

enum Direction {
  DOWN_RIGHT,
  DOWN_LEFT,
  UP_RIGHT,
  UP_LEFT,
}

interface Vector2 {
  x: number;
  y: number;
}

const directionToTranslation: Record<Direction, Vector2> = {
  [Direction.DOWN_RIGHT]: { x: 2, y: 1 },
  [Direction.DOWN_LEFT]: { x: -2, y: 1 },
  [Direction.UP_RIGHT]: { x: 2, y: -1 },
  [Direction.UP_LEFT]: { x: -2, y: -1 },
};

let currentDirection = Direction.DOWN_RIGHT;

const rotateCurrentDirection = () => {
  currentDirection = currentDirection === 3 ? 0 : currentDirection + 1;
};

const isObjectInBounts = (objectBounds: Bounds, appCanvas: DOMRect) => {
    console.log({
        objectTop: objectBounds.top,
        objectBottom: objectBounds.bottom,
        objectRight: objectBounds.right,
        objectLeft: objectBounds.left,
        canvasY: appCanvas.y,
        canvasX: appCanvas.x,
        canvasWidth: appCanvas.width,
        canvasHeight: appCanvas.height,
    })
    return (
        objectBounds.top < appCanvas.height &&
        objectBounds.bottom > appCanvas.y &&
        objectBounds.right < appCanvas.width &&
        objectBounds.left > appCanvas 
    )
}

export const handleMovement = (objectToMove: Sprite, app: Application) => {
  objectToMove.x += 1;
  objectToMove.y += 1;
  isObjectInBounts(objectToMove.getBounds(), app.canvas.getBoundingClientRect());
};
