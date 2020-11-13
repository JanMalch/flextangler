/**
 * Converts degree to radian, e.g. `180` is `Math.PI`.
 * @param degree the angle in degrees
 */
export function degreeToRadian(degree: number): number {
  return (Math.PI * degree) / 180;
}
