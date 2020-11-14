import { ORIGIN, p } from '../factories';
import { glueSideParts, glueTopParts } from '../formulas/glue';
import type { InputValues, Point, Triangle } from '../types';
import { moveAlongPath, movePointlike } from './utils';

/**
 * Draws the glue areas on the canvas.
 * @param ctx the canvas' CanvasRenderingContext2D
 * @param refPoint a reference point
 * @param triangle the triangle definition
 * @param textPoint the coordinates for the text in the triangle
 * @param textBaseline the baseline mode for the text
 * @param beforeFillText callback before fill text is called
 */
export function drawGlueArea(
  ctx: CanvasRenderingContext2D,
  refPoint: Point,
  triangle: Triangle,
  textPoint: Point,
  textBaseline: CanvasTextBaseline,
  beforeFillText?: () => void
): void {
  ctx.save();

  ctx.beginPath();
  moveAlongPath(ctx, movePointlike(refPoint, triangle), triangle.points);
  ctx.closePath();

  // background
  ctx.fillStyle = '#eeeeee';
  ctx.fill();

  // text
  ctx.fillStyle = '#333333';
  ctx.font = '18px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = textBaseline;

  beforeFillText && beforeFillText();
  const dest = movePointlike(textPoint, refPoint);
  ctx.fillText('Glue', dest.x, dest.y);

  ctx.restore();
}

export function drawGlue(
  ctx: CanvasRenderingContext2D,
  inputValues: InputValues,
  glueWidth: number
) {
  const topParts = glueTopParts(inputValues);
  const sideParts = glueSideParts(inputValues);

  for (const topPart of topParts) {
    drawGlueArea(
      ctx,
      ORIGIN,
      topPart,
      p(topPart.x + topPart.points[1].x, (topPart.y + topPart.points[1].y) / 2),
      'bottom'
    );
  }

  for (const sidePart of sideParts) {
    drawGlueArea(
      ctx,
      ORIGIN,
      sidePart,
      p(
        sidePart.x + sidePart.points[1].x,
        sidePart.y + sidePart.points[1].y / 2
      ),
      'middle',
      () => ctx.translate(glueWidth / 2, 0)
    );
  }
}
