import type { TriangleDef } from './types';

export const upwardTriangle: TriangleDef = [
  { x: 0.5, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];

export const downwardTriangle: TriangleDef = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0.5, y: 1 },
];
