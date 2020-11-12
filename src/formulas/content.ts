import { p } from '../factories';
import type { Rectangle, RectangleDef, TriangleDef } from '../types';

/**
 * Der Innenwinkel an der Hypothenuse eines gleichschenkligen Dreiecks,
 * dessen Höhe und Breite gleich ist.
 */
export const magicAngle = 63.435;
export const magicWidth = Math.sqrt(3) / 4;
export const magicScale = 2 / Math.sqrt(3);
export const contentTriangles: [
  TriangleDef,
  TriangleDef,
  TriangleDef,
  TriangleDef,
  TriangleDef,
  TriangleDef
] = [
  // south west
  [p(0, 0.5), p(0.5, 0.5), p(0.25, magicWidth + 0.5)],
  // north west
  [p(0, 0.5), p(0.5, 0.5), p(0.25, 0.5 - magicWidth)],
  // north
  [p(0.25, 0.5 - magicWidth), p(0.75, 0.5 - magicWidth), p(0.5, 0.5)],
  // north east
  [p(0.75, 0.5 - magicWidth), p(1, 0.5), p(0.5, 0.5)],
  // south east
  [p(0.5, 0.5), p(1, 0.5), p(0.75, 0.5 + magicWidth)],
  // south
  [p(0.5, 0.5), p(0.25, 0.5 + magicWidth), p(0.75, 0.5 + magicWidth)],
];

/**
 * - `[0]` &rarr; south west
 * - `[1]` &rarr; north west
 * - `[2]` &rarr; north
 * - `[3]` &rarr; north east
 * - `[4]` &rarr; south east
 * - `[5]` &rarr; south
 */
export const contentRectangleWrapper: [
  Rectangle,
  Rectangle,
  Rectangle,
  Rectangle,
  Rectangle,
  Rectangle
] = [
  // south west
  {
    x: 0,
    y: 0.5,
    width: 0.5,
    height: magicWidth,
  },
  // north west
  {
    x: 0,
    y: 0.5 - magicWidth,
    width: 0.5,
    height: magicWidth,
  },
  // north
  {
    x: 0.25,
    y: 0.5 - magicWidth,
    width: 0.5,
    height: magicWidth,
  },
  // north east
  {
    x: 0.5,
    y: 0.5 - magicWidth,
    width: 0.5,
    height: magicWidth,
  },
  // south east
  {
    x: 0.5,
    y: 0.5,
    width: 0.5,
    height: magicWidth,
  },
  // south
  {
    x: 0.25,
    y: 0.5,
    width: 0.5,
    height: magicWidth,
  },
];

/**
 * - `[0]` &rarr; south west
 * - `[1]` &rarr; north west
 * - `[2]` &rarr; north
 * - `[3]` &rarr; north east
 * - `[4]` &rarr; south east
 * - `[5]` &rarr; south
 * @param centerCrop
 */
export function resolveContentTriangles(
  centerCrop: RectangleDef
): [
  TriangleDef,
  TriangleDef,
  TriangleDef,
  TriangleDef,
  TriangleDef,
  TriangleDef
] {
  return contentTriangles.map((triangle) => {
    return triangle.map((point) =>
      p(point.x * centerCrop.width, point.y * centerCrop.height)
    ) as TriangleDef;
  }) as [
    TriangleDef,
    TriangleDef,
    TriangleDef,
    TriangleDef,
    TriangleDef,
    TriangleDef
  ];
}
