<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { drawGlue } from '../drawing/glue';
  import { foldingLines, setSupportingLineStyle } from '../drawing/lines';
  import { magicAngle, magicHeight } from '../formulas/content';
  import { degreeToRadian } from '../formulas/math';
  import { upwardTriangle, downwardTriangle } from '../shapes';
  import type { Point, ProcessingOptions } from '../types';
  import TriangleProcessing from './TriangleProcessing.svelte';

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
    if (ctx != null) {
      // TODO: clear rect & streamline rendering on changes
      drawGlue(ctx, inputValues, glueWidth);
      if (drawCuttingLines) {
        doDrawCuttingLines();
      }
      if (drawFoldingLines) {
        doDrawFoldingLines();
      }
    }
  }

  const lookup: ProcessingOptions[] = [
    {
      // A0
      relativeRectangle: {
        x: 0,
        y: 0.5,
        width: 0.5,
        height: magicHeight,
      },
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(degreeToRadian(90));
        ctx.drawImage(prev, prev.width / -2, prev.height / -2);
      },
    },
    {
      // A1
      relativeRectangle: {
        x: 0,
        y: 0.5 - magicHeight,
        width: 0.5,
        height: magicHeight,
      },
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(degreeToRadian(90));
        ctx.drawImage(prev, prev.width / -2, prev.height / -2);
      },
    },
    {
      // A2
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.translate(0, prev.width / 2);
        ctx.rotate(degreeToRadian(-30));
        ctx.drawImage(prev, 0, 0);
      },
      relativeRectangle: {
        x: 0.25,
        y: 0.5 - magicHeight,
        width: 0.5,
        height: magicHeight,
      },
    },
    {
      // A3
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.rotate(degreeToRadian(-30));
        ctx.drawImage(prev, prev.width / -2, 0);
      },
      relativeRectangle: {
        x: 0.5,
        y: 0.5 - magicHeight,
        width: 0.5,
        height: magicHeight,
      },
    },
    {
      // A4
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.translate(0, canvas.height / 2);
        ctx.rotate(degreeToRadian(-150));
        ctx.drawImage(prev, canvas.height * -1, 0);
      },
      relativeRectangle: {
        x: 0.5,
        y: 0.5,
        width: 0.5,
        height: magicHeight,
      },
    },
    {
      // A5
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.translate(canvas.width, canvas.height / 2);
        ctx.rotate(degreeToRadian(-150));
        ctx.drawImage(prev, 0, canvas.width * -1);
      },
      relativeRectangle: {
        x: 0.25,
        y: 0.5,
        width: 0.5,
        height: magicHeight,
      },
    },
  ];

  $: allTriangleSetups = drawables.some((d) => !(d instanceof HTMLImageElement))
    ? []
    : drawables.map((drawable) =>
        Array(6)
          .fill(0)
          .map((_, i) => {
            return {
              image: drawable,
              clippingTriangle: i % 2 === 0 ? downwardTriangle : upwardTriangle,
              ...lookup[i],
            };
          })
      );

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
    { detail: partialCanvas }: { detail: HTMLCanvasElement },
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
    if (line === 3 && index === 5) {
      dispatch('finish', canvas);
    }
  }
</script>

<svelte:options accessors />

<div aria-hidden="true" hidden>
  {#each allTriangleSetups as triangleSetups, line}
    {#each triangleSetups as setup, i}
      <TriangleProcessing
        {...setup}
        inputValues="{inputValues}"
        on:finish="{(ev) => onProcessingFinish(ev, line, i)}" />
    {/each}
  {/each}
</div>

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
