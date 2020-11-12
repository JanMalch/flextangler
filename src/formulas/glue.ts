import { p } from '../factories';
import type { InputValues, Triangle } from '../types';
import { scaleTriangle } from './util';

const topGlueTriangle = scaleTriangle([p(0, 0), p(1, 0.5), p(2, 0)]);

/**
 * Calculates the glue parts on top as a triangle, that can later be cut off.
 *
 * The triangle has the relative points `[(0, 0), (1, 0.5), (2, 0)]`.
 * @param values
 */
export function glueTopParts(
  values: InputValues
): [Triangle, Triangle, Triangle] {
  return [
    {
      x: 0,
      y: 0,
      points: topGlueTriangle(values),
    },
    {
      x: values.triangleHeight * 2,
      y: 0,
      points: topGlueTriangle(values),
    },
    {
      x: values.triangleHeight * 4,
      y: 0,
      points: topGlueTriangle(values),
    },
  ];
}

const sideGlueTriangle = scaleTriangle([p(0, 0), p(0, 1), p(1, 0.5)]);

/**
 * Calculates the glue parts on the side as a triangle, that can later be cut off.
 *
 * The triangle has the relative points `[(0, 0), (0, 1), (1, 0.5)]`.
 * @param values
 */
export function glueSideParts(values: InputValues): [Triangle, Triangle] {
  return [
    {
      x: values.triangleHeight * 6,
      y: 0,
      points: sideGlueTriangle(values),
    },
    {
      x: values.triangleHeight * 6,
      y: values.triangleBase,
      points: sideGlueTriangle(values),
    },
  ];
}
