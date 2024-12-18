import { Container, PointData, Sprite } from "pixi.js";
import { TextureKey, TextureManager } from "./TextureManager";
import { PositionVector2 } from "./gameTypes";
import { Controller, ControllerButton } from "./controllers/Controller";
import { Map } from "./Map";

/** type for the Ship direction. Dependent on the ControllerButton enum */
type ShipDirection = Extract<
  ControllerButton,
  ControllerButton.DOWN | ControllerButton.UP | ControllerButton.LEFT | ControllerButton.RIGHT
>;

export class Ship {
  private _isMoving: boolean = false;
  private static TOTAL_ANIMATION_FRAMES = 7;
  private static SIZE_OF_SPRITE = 16;
  private _currentAnimationFrame = 0;

  private _spriteMap: Record<ShipDirection, Sprite> = {
    [ControllerButton.UP]: new Sprite(TextureManager.getTexture(TextureKey.SHIP_UP)),
    [ControllerButton.LEFT]: new Sprite(TextureManager.getTexture(TextureKey.SHIP_LEFT)),
    [ControllerButton.DOWN]: new Sprite(TextureManager.getTexture(TextureKey.SHIP_DOWN)),
    [ControllerButton.RIGHT]: new Sprite(TextureManager.getTexture(TextureKey.SHIP_RIGHT)),
  };

  private _currentSprite = this._spriteMap[ControllerButton.RIGHT];
  public get currentSprite(): Sprite {
    return this._currentSprite;
  }

  private _previousMapPosition: PositionVector2 = { x: 0, y: 0 };
  private _mapPosition: PositionVector2 = { x: 0, y: 0 };

  /** Returns a copy of the ships location (so the ship can't be forcefully moved) */
  public get mapPosition(): PositionVector2 {
    return { ...this._mapPosition };
  }

  /** Updates the position of the ship within the map */
  private updateMapPosition(newPosition: PositionVector2) {
    this._previousMapPosition = this.mapPosition;
    this._mapPosition = newPosition;
  }

  /** Updates the position of the ship sprites for rendering */
  private updateSpritePosition(newPosition: PositionVector2) {
    this._currentSprite.position = newPosition;
  }

  /**
   * Updates the sprite to render in the game.
   *
   * If the ship is moving in a new direction, the current sprite becomes invisible and the new sprite becomes visible.
   *
   * Also updates the sprite position to make sure it appears in the correct position.
   */
  private updateVisibleSprite(direction: ShipDirection) {
    if (this._currentSprite !== this._spriteMap[direction]) {
      const spritePosition: PointData = this.currentSprite.position;
      this._currentSprite.visible = false;
      this._currentSprite = this._spriteMap[direction];
      this._currentSprite.visible = true;
      this._currentSprite.position = spritePosition;
    }
  }

  private controller: Controller;

  constructor(playerController: Controller) {
    this.controller = playerController;
  }

  /**
   * Returns new position of where the ship would move, given a direction.
   *
   * If the ship would move off the map, the postition will wrap around.
   * (Moving left on position {x: 0, y: 0} would move you to position {x: [mapWidth-1], y: 0})
   */
  private calculateNewPosition(direction: ShipDirection): PositionVector2 {
    switch (direction) {
      case ControllerButton.RIGHT:
        return { x: (this._mapPosition.x + 1) % Map.tileMapSize.w, y: this._mapPosition.y };
      case ControllerButton.LEFT:
        return { x: (Map.tileMapSize.w + this._mapPosition.x - 1) % Map.tileMapSize.w, y: this._mapPosition.y };
      case ControllerButton.DOWN:
        return { x: this._mapPosition.x, y: (this._mapPosition.y + 1) % Map.tileMapSize.h };
      case ControllerButton.UP:
        return { x: this._mapPosition.x, y: (Map.tileMapSize.h + this._mapPosition.y - 1) % Map.tileMapSize.h };
    }
  }

  private moveShip(): void {
    // If we're not moving, well - don't move!
    if (!this._isMoving) return;

    // Update the current animation frame
    this._currentAnimationFrame += 1;

    // Determine where the ship's sprite should be
    const distanceToMoveEachFrame: PositionVector2 = {
      x: (this.mapPosition.x - this._previousMapPosition.x) * (Ship.SIZE_OF_SPRITE / Ship.TOTAL_ANIMATION_FRAMES),
      y: (this.mapPosition.y - this._previousMapPosition.y) * (Ship.SIZE_OF_SPRITE / Ship.TOTAL_ANIMATION_FRAMES),
    };
    const newSpritePosition = {
      x: this._currentSprite.position.x + distanceToMoveEachFrame.x,
      y: this._currentSprite.position.y + distanceToMoveEachFrame.y,
    };

    if (
      Math.abs(this.mapPosition.x * Ship.SIZE_OF_SPRITE - newSpritePosition.x) >= Ship.SIZE_OF_SPRITE ||
      Math.abs(this.mapPosition.y * Ship.SIZE_OF_SPRITE - newSpritePosition.y) >= Ship.SIZE_OF_SPRITE ||
      this._currentAnimationFrame >= Ship.TOTAL_ANIMATION_FRAMES
    ) {
      // If we're at the end of the animation, or the ship's sprite would be sent past its intended destination,
      // Put the sprite at it's destination, and stop moving
      this.updateSpritePosition({
        x: this.mapPosition.x * Ship.SIZE_OF_SPRITE,
        y: this.mapPosition.y * Ship.SIZE_OF_SPRITE,
      });
      // reset the animation frame, and tell the ship we're no longer moving
      this._currentAnimationFrame = 0;
      this._isMoving = false;
    } else {
      // Otherwise, keep movin'
      this.updateSpritePosition(newSpritePosition);
    }
  }

  public update(): void {
    this.moveShip();

    if (this._isMoving) return;

    const directionToMove = this.controller.directionButtonDown;
    if (directionToMove === null) return;
    this.updateVisibleSprite(directionToMove);

    const potentialNewPosition = this.calculateNewPosition(directionToMove);
    if (!Map.isLand(potentialNewPosition)) {
      this._isMoving = true;
      this.updateMapPosition(potentialNewPosition);
    }
  }

  public placeShipsInContainer(container: Container) {
    // Make sure all sprites are in the right spot
    this.updateMapPosition(this._mapPosition);

    // Put all sprites in the container, and make them invisible
    Object.values(this._spriteMap).forEach((sprite) => {
      container.addChild(sprite);
      sprite.visible = false;
    });

    // Make the current sprite visible
    this._currentSprite.visible = true;
  }
}
