import { p } from '../../src/factories';
import { scale, scaleTriangle } from '../../src/formulas/util';
import type { InputValues } from '../../src/types';

describe('scale', () => {
  const values: InputValues = { triangleBase: 2, triangleHeight: 2 };
  it('should move the point correctly', () => {
    expect(scale(p(0, 0))(values)).toEqual(p(0, 0));
    expect(scale(p(1, 1))(values)).toEqual(p(2, 2));
    expect(scale(p(1, 1))({ triangleBase: 2, triangleHeight: 0 })).toEqual(
      p(0, 2)
    );
  });
});

describe('scaleTriangle', () => {
  const values: InputValues = {
    triangleBase: 2,
    triangleHeight: 2,
  };
  it('should move the point correctly', () => {
    expect(scaleTriangle([p(0, 0), p(0, 1), p(1, 1)])(values)).toEqual([
      p(0, 0),
      p(0, 2),
      p(2, 2),
    ]);

    expect(
      scaleTriangle([p(0, 0), p(0, 1), p(1, 1)])({
        triangleBase: 2,
        triangleHeight: 1,
      })
    ).toEqual([p(0, 0), p(0, 2), p(1, 2)]);
  });
});
