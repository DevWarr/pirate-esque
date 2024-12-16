export interface ButtonState {
  wasDown: boolean;
  isDown: boolean;
}

export class Button {
  /**
   * If the user has pressed the button.
   *
   * We're using event listeners to detect these button presses,
   * but we're also using frame-by-frame detection for the button from the game's perspective.
   *
   * We need to then separate whether the user pressed the button from the game detecting the button.
   */
  public userPressed: boolean = false;

  /** If the button was pressed down on the previous frame */
  private _wasDown: boolean = false;
  /** If the button is pressed down on the current frame */
  private _isDown: boolean = false;

  /** Returns true if the button WASN'T pressed down on the previous frame, but is now pressed down */
  public get isPressed(): boolean {
    return this._isDown && !this._wasDown;
  }

  /** Returns true if the button WAS pressed down on the previous frame, and is still pressed down */
  public get isHeld(): boolean {
    return this._isDown && this._wasDown;
  }

  /** Returns true if the button WAS pressed down on the previous frame, but is no longer pressed down */
  public get isDown(): boolean {
    return this._isDown;
  }

  public update(): void {
    this._wasDown = this._isDown;
    this._isDown = this.userPressed;
  }

  public getButtonState(): ButtonState {
    return {
      wasDown: this._wasDown,
      isDown: this._isDown,
    };
  }
}
