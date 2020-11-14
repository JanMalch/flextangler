import type { Point, TriangleDef } from '../types';

/**
 * Moves the given point by multiplying both coordinates with the `size`.
 * @param point the point to move
 */
export function scale(point: Point): (size: number) => Point {
  return (size) => ({
    x: point.x * size,
    y: point.y * size,
  });
}

/**
 * Scales the given triangle, by moving all points.
 * @param triangle the triangle to scale
 * @see scale
 */
export function scaleTriangle(
  triangle: TriangleDef
): (size: number) => TriangleDef {
  return (size: number) => {
    return triangle.map((p) => scale(p)(size)) as TriangleDef;
  };
}
