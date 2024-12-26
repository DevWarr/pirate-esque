import { highLevelMap, MapSection } from "../mapLayout";
import { IPositionVector2, PositionVector2 } from "../models/PositionVector2";

export class MapManager {
  private static _map: MapSection[][] = highLevelMap;
  private static _currentMapPosition: PositionVector2 = new PositionVector2(0, 0);

  public static get currentMapPosition(): PositionVector2 {
    return this._currentMapPosition;
  }

  /**
   * Updates the current map position by the given x and y values
   *
   * Usually used with position vectors up, down, left, and right
   */
  public static moveMapPosition({ x, y }: IPositionVector2): void {
    MapManager._currentMapPosition = PositionVector2.add(this._currentMapPosition, { x, y });
  }

  /**
   * @returns the map section at the given x and y coordinates, or null if no map section exists at that position
   */
  public static getMapSection({ x, y }: IPositionVector2): MapSection | null {
    return this._map[y]?.[x] ?? null;
  }
}
