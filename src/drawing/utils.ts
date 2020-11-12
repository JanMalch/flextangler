import { p } from '../factories';
import { degreeToRadian } from '../formulas/math';
import type { Point, Rectangle } from '../types';

/**
 * Moves the canvas to a point within the given rectangle.
 * This point is defined as relative dimensions via the `offset` argument.
 *
 * The canvas is then rotated around this point.
 *
 * Does not save or restore the canvas state.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param rectangle the rectangle to rotate in
 * @param offset the relative offset to find the rotation point in the rectangle
 * @param rotationInDegrees the angle to rotate by in degrees
 * @example
 * rotateAround(
 *   ctx,
 *   { x: 50, y: 50, width: 100, height: 500 },
 *   rotateAround.CENTER_CENTER,
 *   90
 * )
 */
export function rotateAround(
  ctx: CanvasRenderingContext2D,
  rectangle: Rectangle,
  offset: Point,
  rotationInDegrees: number
): void {
  ctx.moveTo(0, 0);
  ctx.translate(
    rectangle.x + rectangle.width * offset.x,
    rectangle.y + rectangle.height * offset.y
  );
  ctx.rotate(degreeToRadian(rotationInDegrees));
}

rotateAround.LEFT_TOP = p(0, 0);
rotateAround.CENTER_TOP = p(0.5, 0);
rotateAround.RIGHT_TOP = p(1, 0);

rotateAround.LEFT_CENTER = p(0, 0.5);
rotateAround.CENTER_CENTER = p(0.5, 0.5);
rotateAround.RIGHT_CENTER = p(1, 0.5);

rotateAround.LEFT_BOTTOM = p(0, 1);
rotateAround.CENTER_BOTTOM = p(0.5, 1);
rotateAround.RIGHT_BOTTOM = p(1, 1);

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
 * @param showLines draw the border of the clip
 * @param refPoint a reference point
 * @param clippingShape a list of points
 * @param callback called after `clip` and before `restore`
 */
export function inClip(
  ctx: CanvasRenderingContext2D,
  showLines: boolean,
  refPoint: Point,
  clippingShape: Point[],
  callback: () => void
) {
  ctx.save();
  ctx.beginPath();
  moveAlongPath(ctx, refPoint, clippingShape);
  ctx.closePath();
  ctx.clip();

  if (showLines) {
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FF0000'; // '#666666';
    ctx.stroke();
  }
  callback();
  ctx.restore();
}

/**
 * Draws and clips the given image.
 * Both the clip and the image position in the canvas will be relative to the `refPoint`.
 *
 * Saves and restores the canvas state.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param showLines draw the border of the clip
 * @param refPoint a reference point
 * @param clippingShape a list of points
 * @param image the image to draw
 * @param destination the destination specification
 * @param source the source specification
 * @see inClip
 * @see drawImage
 */
export function clipImage(
  ctx: CanvasRenderingContext2D,
  showLines: boolean,
  refPoint: Point,
  clippingShape: Point[],
  image: CanvasImageSource,
  destination: Rectangle,
  source?: Rectangle
) {
  return inClip(ctx, showLines, refPoint, clippingShape, () =>
    drawImage(ctx, refPoint, image, destination, source)
  );
}
