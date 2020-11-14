import type { Point, Rectangle } from '../types';

/**
 * Draws the given image based on the given rectangles.
 *
 * Does not save or restore the canvas state.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param image the image to draw
 * @param destination the destination specification
 * @param source the source specification
 * @see https://stackoverflow.com/a/26015533
 */
export function drawImage(
  ctx: CanvasRenderingContext2D,
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
      destination.x,
      destination.y,
      destination.width,
      destination.height
    );
  } else {
    ctx.drawImage(
      image,
      destination.x,
      destination.y,
      destination.width,
      destination.height
    );
  }
}

/**
 * Creates line in the context along the given `points`.
 *
 * Does not start or end a path.
 *
 * Does not save or restore the canvas state.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param points a list of points
 */
export function moveAlongPath(
  ctx: CanvasRenderingContext2D,
  points: Point[]
) {
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
}

/**
 * Creates the given clipping shape and invokes the callback.
 *
 * Saves and restores the canvas state.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param clippingShape a list of points
 * @param callback called after `clip` and before `restore`
 */
export function inClip(
  ctx: CanvasRenderingContext2D,
  clippingShape: Point[],
  callback: () => void
) {
  ctx.save();
  ctx.beginPath();
  moveAlongPath(ctx, clippingShape);
  ctx.closePath();
  ctx.clip();
  callback();
  ctx.restore();
}

