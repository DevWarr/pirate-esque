import fs from "fs";
import { PositionAndSizeVector, SizeVector2 } from "../gameTypes";

interface SpriteInfo {
  frame: PositionAndSizeVector;
  rotated: boolean;
  trimmed: boolean;
  sourceSize: SizeVector2;
  duration: number;
}

interface SpriteInfoWithName extends SpriteInfo {
  filename: string;
}

interface KeyframeInfo {
  frame: number;
  bounds: PositionAndSizeVector;
}

interface SliceInfo {
  name: string;
  /**
   * HEX color code with alpha information at the beginning.
   *
   * @example "#0000ffff"
   */
  color: string;
  keys: KeyframeInfo[];
}

const PATH_TO_PROJECT_ROOT = process.argv[2] ?? "../..";

// Load the JSON file
const rawData: string = fs.readFileSync(`${PATH_TO_PROJECT_ROOT}/assets/sprites/spritesheet.json`, "utf8");

//eslint-disable-next-line
const json: Record<string, any> = JSON.parse(rawData);

// Extract frames and slices
const frames: SpriteInfoWithName[] = json.frames;
const slices: SliceInfo[] = json.meta.slices;

// Create a new object to store updated frames
const updatedFrames: Record<string, SpriteInfo> = {};

// Iterate over each frame and match it with the corresponding slice
frames.forEach((frame) => {
  // Find the matching slice based on bounds
  const matchingSlice = slices.find((slice) =>
    slice.keys.some(
      (key) =>
        key.bounds.x === frame.frame.x &&
        key.bounds.y === frame.frame.y &&
        key.bounds.w === frame.frame.w &&
        key.bounds.h === frame.frame.h,
    ),
  );

  if (matchingSlice) {
    // Create a new filename with the slice's name
    // expected file name: `spritesheet_layer-{layer}_frame-{frame}.png`
    const newFilename = frame.filename.replace("layer-", `layer-${matchingSlice.name}`);

    // Add the frame to the updatedFrames object using the filename as the key
    updatedFrames[newFilename] = {
      frame: frame.frame,
      rotated: frame.rotated,
      duration: frame.duration,
      trimmed: frame.trimmed,
      sourceSize: frame.sourceSize,
    };
  } else {
    console.warn({
      message: "no matching slice found",
      frame,
    });
  }
});

// Replace the old frames array with the updated object
json.frames = updatedFrames;

// Save the updated JSON to a new file
fs.writeFileSync(`${PATH_TO_PROJECT_ROOT}/assets/sprites/spritesheet_updated.json`, JSON.stringify(json, null, 2));

console.log("Updated JSON saved as spritesheet_updated.json");
