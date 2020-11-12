import {
  centerCropLargestSquare,
  isLandscape,
  isPortrait,
  isSquared,
  shortestSide,
} from '../../src/formulas/processing';

describe('shortestSide', () => {
  it('should return the correct value', () => {
    expect(shortestSide({ naturalWidth: 100, naturalHeight: 200 })).toBe(100);
    expect(shortestSide({ naturalWidth: 200, naturalHeight: 200 })).toBe(200);
  });

  it('should throw for dimensions <= 0', () => {
    expect(() =>
      shortestSide({ naturalWidth: 100, naturalHeight: -200 })
    ).toThrow();
  });
});

describe('isLandscape', () => {
  it('should return the correct value', () => {
    expect(isLandscape({ naturalWidth: 200, naturalHeight: 100 })).toBe(true);
    expect(isLandscape({ naturalWidth: 100, naturalHeight: 100 })).toBe(true);
    expect(isLandscape({ naturalWidth: 100, naturalHeight: 200 })).toBe(false);
  });
});

describe('isPortrait', () => {
  it('should return the correct value', () => {
    expect(isPortrait({ naturalWidth: 200, naturalHeight: 100 })).toBe(false);
    expect(isPortrait({ naturalWidth: 100, naturalHeight: 100 })).toBe(true);
    expect(isPortrait({ naturalWidth: 100, naturalHeight: 200 })).toBe(true);
  });
});

describe('isSquared', () => {
  it('should return the correct value', () => {
    expect(isSquared({ naturalWidth: 200, naturalHeight: 100 })).toBe(false);
    expect(isSquared({ naturalWidth: 100, naturalHeight: 100 })).toBe(true);
    expect(isSquared({ naturalWidth: 100, naturalHeight: 200 })).toBe(false);
  });
});

describe('centerCropLargestSquare', () => {
  it('should return the correct values for squared images', () => {
    const actual = centerCropLargestSquare({
      naturalWidth: 100,
      naturalHeight: 100,
    });
    expect(actual).toEqual({
      width: 100,
      height: 100,
      x: 0,
      y: 0,
    });
  });
  it('should return the correct values for landscape images', () => {
    const actual = centerCropLargestSquare({
      naturalWidth: 1000,
      naturalHeight: 100,
    });
    expect(actual).toEqual({
      width: 100,
      height: 100,
      x: 450,
      y: 0,
    });
  });
  it('should return the correct values for portrait images', () => {
    const actual = centerCropLargestSquare({
      naturalWidth: 100,
      naturalHeight: 1000,
    });
    expect(actual).toEqual({
      width: 100,
      height: 100,
      x: 0,
      y: 450,
    });
  });
});
