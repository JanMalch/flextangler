import {
  degreeToRadian,
  legOfIsoscelesTriangle,
  pythagorean,
} from '../../src/formulas/math';

describe('pythagorean', () => {
  it('should compute correctly', () => {
    expect(pythagorean(3, 4)).toBe(5);
  });
});

describe('legOfIsoscelesTriangle', () => {
  it('should compute correctly', () => {
    expect(
      legOfIsoscelesTriangle({
        base: 6,
        height: 4,
      })
    ).toBe(5);
  });
});

describe('degreeToRadian', () => {
  it('should compute correctly', () => {
    expect(degreeToRadian(0)).toBe(0);
    expect(degreeToRadian(90)).toBe(0.5 * Math.PI);
    expect(degreeToRadian(180)).toBe(Math.PI);
    expect(degreeToRadian(270)).toBe(1.5 * Math.PI);
    expect(degreeToRadian(360)).toBe(2 * Math.PI);
    expect(degreeToRadian(-90)).toBe(-0.5 * Math.PI);
  });
});
