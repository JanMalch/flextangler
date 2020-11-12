import type { TriangleDef } from './types';

export const leftwardTriangle: TriangleDef = [
  { x: 0, y: 0.5 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
];

export const rightwardTriangle: TriangleDef = [
  { x: 0, y: 0 },
  { x: 1, y: 0.5 },
  { x: 0, y: 1 },
];
