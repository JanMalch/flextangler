import { movePointlike, rotateAround } from '../../src/drawing/utils';
import { p } from '../../src/factories';
import { MockContext } from './mock';

describe('rotateAround', () => {
  let mockCtx: MockContext;

  beforeEach(() => {
    mockCtx = new MockContext();
  });

  describe('squares', () => {
    it('should rotate around the center', () => {
      rotateAround(
        mockCtx,
        { x: 50, y: 0, width: 50, height: 50 },
        rotateAround.CENTER_CENTER,
        180
      );
      expect(mockCtx._x).toBe(75);
      expect(mockCtx._y).toBe(25);
      expect(mockCtx._rotation).toBe(Math.PI);
    });

    it('should rotate around the top right', () => {
      rotateAround(
        mockCtx,
        { x: 50, y: 0, width: 50, height: 50 },
        rotateAround.RIGHT_TOP,
        180
      );
      expect(mockCtx._x).toBe(100);
      expect(mockCtx._y).toBe(0);
      expect(mockCtx._rotation).toBe(Math.PI);
    });

    it('should rotate around the bottom right', () => {
      rotateAround(
        mockCtx,
        { x: 50, y: 0, width: 50, height: 50 },
        rotateAround.RIGHT_BOTTOM,
        180
      );
      expect(mockCtx._x).toBe(100);
      expect(mockCtx._y).toBe(50);
      expect(mockCtx._rotation).toBe(Math.PI);
    });
  });
});

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
