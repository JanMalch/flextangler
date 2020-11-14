import type { Point, Rectangle } from '../types';

/**
 * Adds the values of `movement` to the given `pointlike` object.
 * The given `pointlike` object will not be mutated, but instead a new object
 * is created by using spread syntax. Thus all other properties remain unchanged.
 * @param pointlike a pointlike object. Must be spreadable
 * @param movement the point to add
 */
export function movePointlike<T extends Point>(
  pointlike: T,
  movement: Point
): T {
  return {
    ...pointlike,
    x: pointlike.x + movement.x,
    y: pointlike.y + movement.y,
  };
}

/**
 * Draws the given image based on the given rectangles.
 * The `refPoint` will be added onto the destination (`scale`) `x` and `y`
 * coordinates in the canvas.
 *
 * Does not save or restore the canvas state.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param refPoint a reference point
 * @param image the image to draw
 * @param destination the destination specification
 * @param source the source specification
 * @see https://stackoverflow.com/a/26015533
 */
export function drawImage(
  ctx: CanvasRenderingContext2D,
  refPoint: Point,
  image: CanvasImageSource,
  destination: Rectangle,
  source?: Rectangle
) {
  if (source != null) {
    ctx.drawImage(
      image,
      source.x,
      source.y,
      source.width,
      source.height,
      destination.x + refPoint.x,
      destination.y + refPoint.y,
      destination.width,
      destination.height
    );
  } else {
    ctx.drawImage(
      image,
      destination.x + refPoint.x,
      destination.y + refPoint.y,
      destination.width,
      destination.height
    );
  }
}

/**
 * Creates line in the context along the given `points`.
 * Each point will be added to the `refPoint`.
 *
 * Does not start or end a path.
 *
 * Does not save or restore the canvas state.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param refPoint a reference point
 * @param points a list of points
 */
export function moveAlongPath(
  ctx: CanvasRenderingContext2D,
  refPoint: Point,
  points: Point[]
) {
  const start = movePointlike(refPoint, points[0]);
  ctx.moveTo(start.x, start.y);
  for (let i = 1; i < points.length; i++) {
    const next = movePointlike(refPoint, points[i]);
    ctx.lineTo(next.x, next.y);
  }
}

/**
 * Creates the given clipping shape and invokes the callback.
 *
 * Saves and restores the canvas state.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param refPoint a reference point
 * @param clippingShape a list of points
 * @param callback called after `clip` and before `restore`
 */
export function inClip(
  ctx: CanvasRenderingContext2D,
  refPoint: Point,
  clippingShape: Point[],
  callback: () => void
) {
  ctx.save();
  ctx.beginPath();
  moveAlongPath(ctx, refPoint, clippingShape);
  ctx.closePath();
  ctx.clip();
  callback();
  ctx.restore();
}

