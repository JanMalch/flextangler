<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { drawGlue } from '../drawing/glue';
  import { foldingLines, setSupportingLineStyle } from '../drawing/lines';
  import {
    extractRotatedTriangle,
    triangleSelectors,
  } from '../drawing/processing';
  import { magicAngle } from '../formulas/content';
  import { degreeToRadian } from '../formulas/math';
  import { downwardTriangle, upwardTriangle } from '../shapes';
  import type { Point } from '../types';

  export let drawables: HTMLImageElement[] = [];
  export let triangleHeight: number;
  export let canvas: HTMLCanvasElement | null = null;
  export let drawCuttingLines = false;
  export let drawFoldingLines = false;

  const dispatch = createEventDispatcher();

  $: ctx = canvas?.getContext('2d')!;

  $: triangleBase = triangleHeight;
  $: inputValues = { triangleBase, triangleHeight };
  $: glueWidth = Math.ceil(triangleHeight * 0.4);

  $: {
    if (
      canvas != null &&
      ctx != null &&
      drawables.length === 4 &&
      drawables.every((d) => d instanceof HTMLImageElement)
    ) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGlue(ctx, inputValues, glueWidth);

      const allTriangleSetups = drawables.map((drawable) =>
        Array(6)
          .fill(0)
          .map((_, i) => {
            return {
              image: drawable,
              clippingTriangle: i % 2 === 0 ? downwardTriangle : upwardTriangle,
              ...triangleSelectors[i],
            };
          })
      );

      for (let line = 0; line < allTriangleSetups.length; line++) {
        const triangleSetups = allTriangleSetups[line];
        for (let i = 0; i < triangleSelectors.length; i++) {
          const setup = triangleSetups[i];
          const result = extractRotatedTriangle(
            inputValues,
            setup.image,
            setup.clippingTriangle,
            setup.relativeRectangle,
            setup.rotation
          );
          onProcessingFinish(result, line, i);
        }
      }

      if (drawCuttingLines) {
        doDrawCuttingLines();
      }
      if (drawFoldingLines) {
        doDrawFoldingLines();
      }

      dispatch('finish', canvas);
    }
  }

  function doDrawCuttingLines() {
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    // bottom zic zac
    ctx.lineTo(0, triangleHeight * 2);
    ctx.lineTo(triangleBase, triangleHeight * 2.5);
    ctx.lineTo(triangleBase * 2, triangleHeight * 2);
    ctx.lineTo(triangleBase * 3, triangleHeight * 2.5);
    ctx.lineTo(triangleBase * 4, triangleHeight * 2);
    ctx.lineTo(triangleBase * 5, triangleHeight * 2.5);
    ctx.lineTo(triangleBase * 6, triangleHeight * 2);
    // around glue
    const yDiff = Math.tan(degreeToRadian(90 - magicAngle)) * glueWidth;
    ctx.lineTo(triangleBase * 6 + glueWidth, triangleHeight * 2 - yDiff);
    ctx.lineTo(triangleBase * 6 + glueWidth, triangleHeight + yDiff);
    ctx.lineTo(triangleBase * 6, triangleHeight);
    ctx.lineTo(triangleBase * 6 + glueWidth, triangleHeight - yDiff);
    ctx.lineTo(triangleBase * 6 + glueWidth, yDiff);
    ctx.lineTo(triangleBase * 6, 0);

    ctx.closePath();

    setSupportingLineStyle(ctx);
    ctx.stroke();

    ctx.restore();
  }

  const drawLine = ({ start, end }: { start: Point; end: Point }) => {
    ctx.beginPath();
    ctx.moveTo(triangleHeight * start.x, triangleBase * start.y);
    ctx.lineTo(triangleHeight * end.x, triangleBase * end.y);
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
          line * (triangleBase / 2)
        );
      } else {
        ctx.drawImage(
          partialCanvas,
          (index - 1) * partialCanvas.width,
          line * (triangleBase / 2)
        );
      }
    } else {
      ctx.drawImage(
        partialCanvas,
        index * partialCanvas.width,
        line * (triangleBase / 2)
      );
    }
  }
</script>

<svelte:options accessors />

<canvas
  class="box-shadow"
  width="{triangleHeight * 6 + glueWidth}"
  height="{triangleBase * 2.5}"
  bind:this="{canvas}"></canvas>

<style>
  canvas {
    border: 1px solid #eeeeee;
    border-radius: 4px;
    padding: 32px;
    background-color: #ffffff;
  }
</style>
