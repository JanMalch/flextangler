/**
 * Calculates the hypotenuse `c` with `a² + b² = c²`.
 * @param a the length a
 * @param b the length b
 */
export function pythagorean(a: number, b: number): number {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

/**
 * Calculates the length of the two legs of an isosceles triangle.
 * @param dimensions the dimensions of the triangle
 */
export function legOfIsoscelesTriangle(dimensions: {
  base: number;
  height: number;
}): number {
  return pythagorean(dimensions.base / 2, dimensions.height);
}

/**
 * Converts degree to radian, e.g. `180` is `Math.PI`.
 * @param degree the angle in degrees
 */
export function degreeToRadian(degree: number): number {
  return (Math.PI * degree) / 180;
}

/**
 * Converts radian to degree, e.g. `Math.PI` is `180`.
 * @param radian the angle in radian
 */
export function radianToDegree(radian: number): number {
  return (radian * 180) / Math.PI;
}

/**
 * Calculates the arcuscotanges of the given angle in radian.
 * @param angleInRadian the angle in radian
 */
export function acot(angleInRadian: number): number {
  return Math.atan(angleInRadian) + 2 * Math.atan(1);
}

export function ctg(x: number): number {
  return 1 / Math.tan(x);
}
export function arcctg(x: number): number {
  return Math.PI / 2 - Math.atan(x);
}
