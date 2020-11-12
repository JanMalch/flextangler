import type { InputValues, Point, TriangleDef } from '../types';

/**
 * Moves the given point by multiplying
 * - the `x` coordinate with the `CoreValues#triangleHeight`
 * - and the `y` coordinate with the `CoreValues#triangleBase`
 * @param point the point to move
 */
export function scale(point: Point): (values: InputValues) => Point {
  return (values) => ({
    x: point.x * values.triangleHeight,
    y: point.y * values.triangleBase,
  });
}

/**
 * Scales the given triangle, by moving all points.
 * @param triangle the triangle to scale
 * @see scale
 */
export function scaleTriangle(
  triangle: TriangleDef
): (values: InputValues) => TriangleDef {
  return (values: InputValues) => {
    return triangle.map((p) => scale(p)(values)) as TriangleDef;
  };
}
