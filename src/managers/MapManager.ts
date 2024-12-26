import { highLevelMap, MapSection } from "../mapLayout";
import { IPositionVector2, PositionVector2 } from "../models/PositionVector2";
import { HazardManager } from "./HazardManager";
import { ItemManager } from "./ItemManager";
import { TerrainManager } from "./TerrainManager";

export class MapManager {
  private static _map: MapSection[][] = highLevelMap;
  private static _currentMapPosition: PositionVector2 = new PositionVector2(0, 0);

  public static get currentMapPosition(): PositionVector2 {
    return this._currentMapPosition;
  }

  /**
   * @returns the current map section the player is in
   */
  public static get currentMapSection(): MapSection {
    return this._map[this._currentMapPosition.y][this._currentMapPosition.x];
  }

  /**
   * Updates the current map position by the given x and y values
   *
   * Usually used with position vectors up, down, left, and right
   */
  public static updateMapPosition(newMapPosition: PositionVector2): void {
    MapManager._currentMapPosition = newMapPosition;

    TerrainManager.buildTerrainMap(this.currentMapSection);
    TerrainManager.updateContainerWithNewMapSprites();

    ItemManager.buildItemMap(this.currentMapSection);
    ItemManager.updateContainerWithNewMapSprites();

    HazardManager.buildHazardMap(this.currentMapSection);
    HazardManager.updateContainerWithNewMapSprites();
  }

  /**
   * @returns the map section at the given x and y coordinates, or null if no map section exists at that position
   */
  public static getMapSection({ x, y }: IPositionVector2): MapSection | null {
    return this._map[y]?.[x] ?? null;
  }
}
