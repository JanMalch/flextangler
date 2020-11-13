import { movePointlike } from '../../src/drawing/utils';
import { p } from '../../src/factories';

describe('movePointlike', () => {
  it('should update x and y and preserve other properties', () => {
    expect(
      movePointlike(
        {
          x: 50,
          y: 50,
          width: 10,
          height: 10,
        },
        p(20, 20)
      )
    ).toEqual({
      x: 70,
      y: 70,
      width: 10,
      height: 10,
    });
    expect(
      movePointlike(
        {
          x: 50,
          y: 50,
          points: [{ x: 10, y: 0 }],
        },
        p(30, 80)
      )
    ).toEqual({
      x: 80,
      y: 130,
      points: [{ x: 10, y: 0 }],
    });
  });
});
