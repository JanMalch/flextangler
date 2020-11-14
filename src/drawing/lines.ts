import { p } from '../factories';

/**
 * Definitions of the folding guide lines.
 */
export const foldingLines = {
  /**
   * The 6 vertical lines
   */
  vertical: Array(6).fill(0).map((_, i) => ({
     start: p(i + 1, 0),
     end: p(i + 1, i % 2 === 0 ? 2.5 : 2),
  })),
  /**
   * The 4 diagonal lines that go from top-left to bottom-right
   */
  diagonalTLBR: [
    { start: p(0, 1), end: p(2, 2) },
    { start: p(0, 0), end: p(4, 2) },
    { start: p(2, 0), end: p(6, 2) },
    { start: p(4, 0), end: p(6, 1) },
  ],
  /**
   * The 4 diagonal lines that go from bottom-left to top-right
   */
  diagonalBLTR: [
    { start: p(0, 1), end: p(2, 0) },
    { start: p(0, 2), end: p(4, 0) },
    { start: p(2, 2), end: p(6, 0) },
    { start: p(4, 2), end: p(6, 1) },
  ],
}

/**
 * Sets the line style for the support lines, i.e. the cutting and folding lines.
 * @param context the current 2D context
 */
export function setSupportingLineStyle(context: CanvasRenderingContext2D) {
  context.setLineDash([5, 10]);
  context.lineWidth = 1;
  context.strokeStyle = '#666666';
}
