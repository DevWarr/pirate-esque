import { HazardTileType } from "./Hazard";
import { ItemTileType } from "./Item";
import { TerrainTileType } from "./Terrain";

type AllHazardMapKeys = (typeof HazardTileType)[keyof typeof HazardTileType];
type AllItemMapKeys = (typeof ItemTileType)[keyof typeof ItemTileType];

type ValidWaterMapKey = `${TerrainTileType.WATER}${AllHazardMapKeys}${AllItemMapKeys}`;
type ValidLandMapKey = `${TerrainTileType.LAND}${HazardTileType.NONE}${ItemTileType.NONE}`;

export type MapTileKey = ValidWaterMapKey | ValidLandMapKey;
