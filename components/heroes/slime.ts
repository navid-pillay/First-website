import type { Dot } from "@/components/heroes/Blobs";

// Shared green slime shapes.

// Beside the hero's photo: a chain of blobs running down to the player
// (viewBox 0 0 120 540). On the draft this piece slithers down the page.
export const COLUMN_DOTS: Dot[] = [
  [60, 30, 39], [42, 92, 28], [70, 150, 46], [52, 226, 32], [78, 290, 41], [50, 360, 25], [66, 420, 34], [44, 490, 21], [96, 520, 14], [18, 200, 12],
];
export const COLUMN_TRAILS = ["60,30 42,92 70,150 52,226 78,290 50,360 66,420 44,490"];
export const COLUMN_WIDTH = 38; // stroke width of the trails

// The splats behind the two program logos (viewBox 0 0 300 300).
export const SPLATS: Dot[][] = [
  [[150, 150, 78], [84, 112, 44], [224, 104, 40], [222, 206, 50], [96, 214, 36], [150, 46, 24], [262, 160, 22], [40, 160, 16], [176, 270, 18], [276, 52, 10], [30, 250, 9]],
  [[150, 150, 74], [206, 88, 46], [92, 92, 34], [86, 204, 48], [214, 214, 38], [150, 262, 24], [268, 140, 18], [34, 140, 20], [150, 34, 14], [252, 268, 10], [44, 54, 9]],
];
