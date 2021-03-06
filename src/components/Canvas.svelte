<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { drawGlue } from '../drawing/glue';
  import { foldingLines, setSupportingLineStyle } from '../drawing/lines';
  import {
    extractRotatedTriangle,
    triangleSelectors,
    triangleSelectorsFlatSides,
  } from '../drawing/processing';
  import { magicAngle } from '../formulas/content';
  import { degreeToRadian } from '../formulas/math';
  import {
    downwardTriangle,
    leftwardTriangle,
    rightwardTriangle,
    upwardTriangle,
  } from '../shapes';
  import type { Point } from '../types';

  export let drawables: HTMLImageElement[] = [];
  export let size: number;
  export let drawCuttingLines: boolean;
  export let drawFoldingLines: boolean;
  export let pointyBottom: boolean;
  export let canvas: HTMLCanvasElement | null = null;

  const dispatch = createEventDispatcher();

  $: ctx = canvas?.getContext('2d')!;
  $: glueWidth = Math.ceil(size * 0.4);

  $: {
    if (canvas != null && ctx != null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGlue(ctx, size, glueWidth);

      const imagesAvailable =
        drawables.length === 4 &&
        drawables.every((d) => d instanceof HTMLImageElement);

      if (imagesAvailable) {
        const usedSelectors = pointyBottom
          ? triangleSelectorsFlatSides
          : triangleSelectors;
        const triangles = pointyBottom
          ? [leftwardTriangle, rightwardTriangle]
          : [downwardTriangle, upwardTriangle];
        const allTriangleSetups = drawables.map((drawable) =>
          Array(6)
            .fill(0)
            .map((_, i) => {
              return {
                image: drawable,
                clippingTriangle: triangles[i % 2],
                ...usedSelectors[i],
              };
            })
        );

        for (let line = 0; line < allTriangleSetups.length; line++) {
          const triangleSetups = allTriangleSetups[line];
          for (let i = 0; i < 6; i++) {
            const setup = triangleSetups[i];
            const result = extractRotatedTriangle(
              size,
              setup.image,
              setup.clippingTriangle,
              setup.relativeRectangle,
              setup.rotation,
              pointyBottom
            );
            onProcessingFinish(result, line, i);
          }
        }
      }

      if (drawCuttingLines) {
        doDrawCuttingLines();
      }
      if (drawFoldingLines) {
        doDrawFoldingLines();
      }

      dispatch('finish', { canvas, imagesAvailable });
    }
  }

  function doDrawCuttingLines() {
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    // bottom zic zac
    ctx.lineTo(0, size * 2);
    ctx.lineTo(size, size * 2.5);
    ctx.lineTo(size * 2, size * 2);
    ctx.lineTo(size * 3, size * 2.5);
    ctx.lineTo(size * 4, size * 2);
    ctx.lineTo(size * 5, size * 2.5);
    ctx.lineTo(size * 6, size * 2);
    // around glue
    const yDiff = Math.tan(degreeToRadian(90 - magicAngle)) * glueWidth;
    ctx.lineTo(size * 6 + glueWidth, size * 2 - yDiff);
    ctx.lineTo(size * 6 + glueWidth, size + yDiff);
    ctx.lineTo(size * 6, size);
    ctx.lineTo(size * 6 + glueWidth, size - yDiff);
    ctx.lineTo(size * 6 + glueWidth, yDiff);
    ctx.lineTo(size * 6, 0);

    ctx.closePath();

    setSupportingLineStyle(ctx);
    ctx.stroke();

    ctx.restore();
  }

  const drawLine = ({ start, end }: { start: Point; end: Point }) => {
    ctx.beginPath();
    ctx.moveTo(size * start.x, size * start.y);
    ctx.lineTo(size * end.x, size * end.y);
    ctx.stroke();
  };

  function doDrawFoldingLines() {
    ctx.save();
    setSupportingLineStyle(ctx);
    foldingLines.vertical.forEach(drawLine);
    foldingLines.diagonalTLBR.forEach(drawLine);
    foldingLines.diagonalBLTR.forEach(drawLine);

    ctx.restore();
  }

  function onProcessingFinish(
    partialCanvas: HTMLCanvasElement,
    line: number,
    index: number
  ) {
    if (line % 2 === 0) {
      if (index === 0) {
        ctx.drawImage(
          partialCanvas,
          5 * partialCanvas.width,
          line * (size / 2)
        );
      } else {
        ctx.drawImage(
          partialCanvas,
          (index - 1) * partialCanvas.width,
          line * (size / 2)
        );
      }
    } else {
      ctx.drawImage(
        partialCanvas,
        index * partialCanvas.width,
        line * (size / 2)
      );
    }
  }
</script>

<svelte:options accessors />

<canvas
  class="box-shadow"
  width="{size * 6 + glueWidth}"
  height="{size * 2.5}"
  bind:this="{canvas}"></canvas>

<style>
  canvas {
    border: 1px solid #eeeeee;
    border-radius: 4px;
    background-color: #ffffff;
    /* width does not affect the data in the canvas */
    max-width: calc(min(95vw, 1400px) - 2px);
  }

  @media (min-width: 840px) {
    canvas {
      padding: 32px;
      max-width: calc(min(95vw, 1400px) - 66px);
    }
  }
</style>
