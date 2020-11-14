import { p } from '../factories';
import type { Triangle } from '../types';
import { scaleTriangle } from './util';

const topGlueTriangle = scaleTriangle([p(0, 0), p(1, 0.5), p(2, 0)]);

/**
 * Calculates the glue parts on top as a triangle, that can later be cut off.
 *
 * The triangle has the relative points `[(0, 0), (1, 0.5), (2, 0)]`.
 * @param size the base size
 */
export function glueTopParts(
  size: number
): [Triangle, Triangle, Triangle] {
  return [
    {
      x: 0,
      y: 0,
      points: topGlueTriangle(size),
    },
    {
      x: size * 2,
      y: 0,
      points: topGlueTriangle(size),
    },
    {
      x: size * 4,
      y: 0,
      points: topGlueTriangle(size),
    },
  ];
}

const sideGlueTriangle = scaleTriangle([p(0, 0), p(0, 1), p(1, 0.5)]);

/**
 * Calculates the glue parts on the side as a triangle, that can later be cut off.
 *
 * The triangle has the relative points `[(0, 0), (0, 1), (1, 0.5)]`.
 * @param size the base size
 */
export function glueSideParts(size: number): [Triangle, Triangle] {
  return [
    {
      x: size * 6,
      y: 0,
      points: sideGlueTriangle(size),
    },
    {
      x: size * 6,
      y: size,
      points: sideGlueTriangle(size),
    },
  ];
}
