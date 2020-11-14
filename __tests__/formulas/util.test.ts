import { p } from '../../src/factories';
import { scale, scaleTriangle } from '../../src/formulas/util';

describe('scale', () => {
  it('should move the point correctly', () => {
    expect(scale(p(0, 0))(2)).toEqual(p(0, 0));
    expect(scale(p(1, 1))(2)).toEqual(p(2, 2));
  });
});

describe('scaleTriangle', () => {
  it('should move the point correctly', () => {
    expect(scaleTriangle([p(0, 0), p(0, 1), p(1, 1)])(2)).toEqual([
      p(0, 0),
      p(0, 2),
      p(2, 2),
    ]);
  });
});
