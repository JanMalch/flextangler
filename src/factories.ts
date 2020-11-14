import type { Point } from './types';

/**
 * Creates a point with the given coordinates.
 * @param x the x coordinate
 * @param y the y coordinate
 */
export function p(x: number, y: number): Point {
  return Object.freeze({ x, y });
}
