/**
 * Describes a single point.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Three points that form a triangle.
 */
export type TriangleDef = [Point, Point, Point];

/**
 * A triangle in the context.
 */
export type Triangle = Point & { points: TriangleDef };

/**
 * Width and height to define a rectangle.
 */
export interface RectangleDef {
  width: number;
  height: number;
}

/**
 * Describes a rectangle whose upper left corner is at `(x, y)`.
 * From there it goes `width` to the right and `height` downwards.
 * Which means that the bottom right corner is at `(x + width, y + height)`.
 */
export type Rectangle = Point & RectangleDef;

/**
 * The original input values that only computations rely on.
 */
export interface InputValues {
  triangleBase: number;
  triangleHeight: number;
}

/**
 * An image with the natural (original) width and height preserved.
 */
export interface NaturalImage {
  naturalWidth: number;
  naturalHeight: number;
}

export interface ProcessingOptions {
  rotation: (canvas: HTMLCanvasElement, prev: HTMLCanvasElement) => void;
  relativeRectangle: Rectangle;
}
