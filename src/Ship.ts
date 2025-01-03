import { Container, PointData, Sprite } from "pixi.js";
import { TextureKey, TextureManager } from "./managers/TextureManager";
import { PositionVector2, SerializedPositionVector2 } from "./models/PositionVector2";
import { Controller, ControllerButton } from "./controllers/Controller";
import { TerrainManager } from "./managers/TerrainManager";
import { ItemManager } from "./managers/ItemManager";
import { HazardManager } from "./managers/HazardManager";
import { MapManager } from "./managers/MapManager";

/** type for the Ship direction. Dependent on the ControllerButton enum */
type ShipDirection = Extract<
  ControllerButton,
  ControllerButton.DOWN | ControllerButton.UP | ControllerButton.LEFT | ControllerButton.RIGHT
>;

const DIRECTION_TO_POSITION_VECTOR = {
  [ControllerButton.DOWN]: PositionVector2.DOWN,
  [ControllerButton.UP]: PositionVector2.UP,
  [ControllerButton.LEFT]: PositionVector2.LEFT,
  [ControllerButton.RIGHT]: PositionVector2.RIGHT,
};

export class Ship {
  private _isMoving: boolean = false;
  private static TOTAL_ANIMATION_FRAMES = 7;
  private static SIZE_OF_SPRITE = TextureManager.SIZE_OF_SPRITE;
  private _currentAnimationFrame = 0;
  private _maxShipHealth = 100;
  private _shipHealth = 100;

  private _spriteMap: Record<ShipDirection, Sprite> = {
    [ControllerButton.UP]: new Sprite(TextureManager.getTexture(TextureKey.SHIP_UP)),
    [ControllerButton.LEFT]: new Sprite(TextureManager.getTexture(TextureKey.SHIP_LEFT)),
    [ControllerButton.DOWN]: new Sprite(TextureManager.getTexture(TextureKey.SHIP_DOWN)),
    [ControllerButton.RIGHT]: new Sprite(TextureManager.getTexture(TextureKey.SHIP_RIGHT)),
  };

  private _currentSprite = this._spriteMap[ControllerButton.RIGHT];
  private _previousMapPosition: PositionVector2 = new PositionVector2(0, 0);
  private _mapPosition: PositionVector2 = new PositionVector2(0, 0);

  constructor(private controller: Controller) {}

  public get currentSprite(): Sprite {
    return this._currentSprite;
  }
  public get mapPosition(): PositionVector2 {
    return this._mapPosition;
  }
  public get serializedPosition(): SerializedPositionVector2 {
    return `${this.mapPosition.x},${this.mapPosition.y}`;
  }
  public get shipHealth(): number {
    return this._shipHealth;
  }
  public set shipHealth(newHealth: number) {
    if (newHealth <= 0) {
      this._shipHealth = 0;
      // Game over
    } else if (newHealth > this._maxShipHealth) {
      this._shipHealth = this._maxShipHealth;
    } else {
      this._shipHealth = newHealth;
    }
  }
  public get maxShipHealth(): number {
    return this._maxShipHealth;
  }

  /**
   * Updates the ship's position on the map.
   *
   * Also
   */
  updateShipPosition(newPosition: PositionVector2) {
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

  private moveShip(): void {
    // If we're not moving, well - don't move!
    if (!this._isMoving) return;

    // Update the current animation frame
    this._currentAnimationFrame += 1;

    // Determine where the ship's sprite should be
    const distanceToMoveEachFrame = new PositionVector2(
      (this.mapPosition.x - this._previousMapPosition.x) * (Ship.SIZE_OF_SPRITE / Ship.TOTAL_ANIMATION_FRAMES),
      (this.mapPosition.y - this._previousMapPosition.y) * (Ship.SIZE_OF_SPRITE / Ship.TOTAL_ANIMATION_FRAMES),
    );
    const newSpritePosition = new PositionVector2(
      this._currentSprite.position.x + distanceToMoveEachFrame.x,
      this._currentSprite.position.y + distanceToMoveEachFrame.y,
    );

    if (
      Math.abs(this.mapPosition.x * Ship.SIZE_OF_SPRITE - newSpritePosition.x) >= Ship.SIZE_OF_SPRITE ||
      Math.abs(this.mapPosition.y * Ship.SIZE_OF_SPRITE - newSpritePosition.y) >= Ship.SIZE_OF_SPRITE ||
      this._currentAnimationFrame >= Ship.TOTAL_ANIMATION_FRAMES
    ) {
      // If we're at the end of the animation, or the ship's sprite would be sent past its intended destination,
      // Put the sprite at it's destination, and stop moving
      this.updateSpritePosition(
        new PositionVector2(this.mapPosition.x * Ship.SIZE_OF_SPRITE, this.mapPosition.y * Ship.SIZE_OF_SPRITE),
      );
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
    if (directionToMove === null) {
      // If we're not moving, don't do anything
      return;
    }
    this.updateVisibleSprite(directionToMove);

    const potentialTileToMoveTo = TerrainManager.getNeighboringMapTile(
      MapManager.currentMapSection,
      this.mapPosition,
      DIRECTION_TO_POSITION_VECTOR[directionToMove],
    );
    if (
      potentialTileToMoveTo.highLevelMapPosition === null ||
      potentialTileToMoveTo.mapSectionPosition === null ||
      !TerrainManager.isWater(potentialTileToMoveTo.mapTileKey)
    ) {
      // If the ship would move into land, don't move
      return;
    }

    this.updateShipPosition(potentialTileToMoveTo.mapSectionPosition);
    this._isMoving = true;
    if (!MapManager.currentMapPosition.isEqualTo(potentialTileToMoveTo.highLevelMapPosition)) {
      // If the ship would move into a new map section, update the map position
      // and update the ship to be one tile away from the edge of the map section so we can see the transition
      MapManager.updateMapPosition(potentialTileToMoveTo.highLevelMapPosition);
      this._previousMapPosition = this._mapPosition.subtract(DIRECTION_TO_POSITION_VECTOR[directionToMove]);
      this.updateSpritePosition(
        new PositionVector2(
          this._previousMapPosition.x * Ship.SIZE_OF_SPRITE,
          this._previousMapPosition.y * Ship.SIZE_OF_SPRITE,
        ),
      );
      console.log({ previous: this._previousMapPosition, current: this._mapPosition });
    }

    const potentialHazard = HazardManager.getHazardAtPosition(this.serializedPosition);
    if (potentialHazard !== null) {
      this.shipHealth -= 10;
    }

    const potentialItem = ItemManager.getItemAtPosition(this.serializedPosition);
    if (potentialItem !== null) {
      this.shipHealth += 10;
      // potentialItem.sprite.visible = false;
    }
  }

  public placeShipInContainer(container: Container, position: PositionVector2 = new PositionVector2(0, 0)) {
    // Make sure all sprites are in the right spot
    this.updateShipPosition(position);

    // Put all sprites in the container, and make them invisible
    Object.values(this._spriteMap).forEach((sprite) => {
      container.addChild(sprite);
      sprite.visible = false;
    });

    // Make the current sprite visible
    this._currentSprite.visible = true;
  }
}
