import { Button } from "./Button";

export enum ControllerButton {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  PAUSE = "PAUSE",
}

type ControllerDirectionButton =
  | ControllerButton.UP
  | ControllerButton.DOWN
  | ControllerButton.LEFT
  | ControllerButton.RIGHT;

const CONTROLLER_DIRECTION_BUTTONS = [
  ControllerButton.UP,
  ControllerButton.DOWN,
  ControllerButton.LEFT,
  ControllerButton.RIGHT,
];

export class Controller {
  private _controllerMap: Record<ControllerButton, Button> = {
    [ControllerButton.UP]: new Button(),
    [ControllerButton.DOWN]: new Button(),
    [ControllerButton.LEFT]: new Button(),
    [ControllerButton.RIGHT]: new Button(),
    [ControllerButton.PAUSE]: new Button(),
  };

  private _directionButtonsDown: ControllerDirectionButton[] = [];

  /**
   * Instantiates the controller with event listeners to update its buttons.
   *
   * NOTE: Instantiating a new controller will create new event listeners!
   */
  constructor() {
    document.onkeydown = this.onKeyDownHandler.bind(this);
    document.onkeyup = this.onKeyUpHandler.bind(this);
  }

  private onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === "w") this._controllerMap[ControllerButton.UP].userPressed = true;
    if (event.key === "a") this._controllerMap[ControllerButton.LEFT].userPressed = true;
    if (event.key === "s") this._controllerMap[ControllerButton.DOWN].userPressed = true;
    if (event.key === "d") this._controllerMap[ControllerButton.RIGHT].userPressed = true;
    if (event.key === " ") this._controllerMap[ControllerButton.PAUSE].userPressed = true;
  }

  private onKeyUpHandler(event: KeyboardEvent) {
    if (event.key === "w") this._controllerMap[ControllerButton.UP].userPressed = false;
    if (event.key === "a") this._controllerMap[ControllerButton.LEFT].userPressed = false;
    if (event.key === "s") this._controllerMap[ControllerButton.DOWN].userPressed = false;
    if (event.key === "d") this._controllerMap[ControllerButton.RIGHT].userPressed = false;
    if (event.key === " ") this._controllerMap[ControllerButton.PAUSE].userPressed = false;
  }

  public updateDirectionButtonPressedDownState(buttonKey: ControllerDirectionButton, directionButton: Button) {
    if (directionButton.isDown && !this._directionButtonsDown.includes(buttonKey)) {
      this._directionButtonsDown.unshift(buttonKey);
    }
    if (!directionButton.isDown && this._directionButtonsDown.includes(buttonKey)) {
      const indexToRemove = this._directionButtonsDown.findIndex((directionButton) => directionButton === buttonKey);
      this._directionButtonsDown.splice(indexToRemove, 1);
    }
  }

  public update(): void {
    Object.keys(this._controllerMap).forEach((buttonKey) => {
      const button: Button = this._controllerMap[buttonKey as ControllerButton];
      button.update();

      // If the button is a direction button, check if
      if (CONTROLLER_DIRECTION_BUTTONS.includes(buttonKey as ControllerButton)) {
        this.updateDirectionButtonPressedDownState(buttonKey as ControllerDirectionButton, button);
      }
    });
  }

  /** Gets a list of ControllerButtons that are pressed */
  public get pressedButtons(): ControllerButton[] {
    return Object.keys(this._controllerMap).filter((controllerButton) => {
      return this._controllerMap[controllerButton as ControllerButton].isPressed;
    }) as ControllerButton[];
  }

  /** Returns whether the pause button is pressed */
  public get isPauseButtonPressed(): boolean {
    return this._controllerMap[ControllerButton.PAUSE].isPressed;
  }

  /**
   * Gets a single direction button that is currently down.
   *
   * NOTE: If multiple buttons are down, we will follow the "wasd" heirarchy:
   *
   * 1. UP
   * 2. LEFT
   * 3. DOWN
   * 4. RIGHT
   *
   * Example: If the user pressed down LEFT and then RIGHT, only LEFT will be returned if LEFT is still down.
   *
   * @returns the controller button pressed, or null if there was no button pressed.
   */
  public get directionButtonDown(): ControllerDirectionButton | null {
    if (this._directionButtonsDown.length === 0) return null;
    return this._directionButtonsDown[0];
  }
}
