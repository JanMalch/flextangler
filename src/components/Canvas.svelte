<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { checks, isDefined } from 'ts-code-contracts';
  import { drawGlue } from '../drawing/glue';
  import { magicScale, magicWidth } from '../formulas/content';
  import { degreeToRadian } from '../formulas/math';
  import { leftwardTriangle, rightwardTriangle } from '../shapes';
  import type { ProcessingOptions } from '../types';
  import TriangleProcessing from './TriangleProcessing.svelte';

  export let drawables: HTMLImageElement[] = [];
  export let triangleHeight: number;
  export let canvas: HTMLCanvasElement | null = null;

  const dispatch = createEventDispatcher();

  $: ctx = canvas?.getContext('2d');

  $: triangleBase = triangleHeight;
  $: inputValues = { triangleBase, triangleHeight };
  $: glueWidth = Math.ceil(triangleHeight * 0.4);

  $: {
    if (ctx != null) {
      drawGlue(ctx, inputValues, glueWidth);
    }
  }

  const lookup: ProcessingOptions[] = [
    {
      relativeRectangle: {
        x: 0.5 - magicWidth,
        y: 0,
        width: magicWidth,
        height: 0.5,
      },
    },
    {
      relativeRectangle: {
        x: 0.5,
        y: 0,
        width: magicWidth,
        height: 0.5,
      },
    },
    {
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.rotate(degreeToRadian(-90));
        ctx.drawImage(prev, prev.width * -1, 0);
      },
      secondRotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.translate(0, canvas.height / 2);
        ctx.rotate(degreeToRadian(-30));
        ctx.drawImage(prev, 0, 0);
      },
      secondCanvasDimensions: (defaultWidth, defaultHeight) => ({
        height: defaultWidth,
        width: defaultHeight,
      }),
      relativeRectangle: {
        x: 0.5,
        y: 0.25,
        width: magicWidth,
        height: 0.5,
      },
    },
    {
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.rotate(degreeToRadian(-30));
        ctx.drawImage(prev, 0, 0);
      },
      secondRotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.rotate(degreeToRadian(-90));
        ctx.drawImage(prev, -1 * inputValues.triangleBase, 0);
      },
      secondCanvasDimensions: (defaultWidth, defaultHeight) => ({
        height: defaultWidth,
        width: defaultHeight,
      }),
      relativeRectangle: {
        x: 0.5,
        y: 0.5,
        width: magicWidth,
        height: 0.5,
      },
    },
    {
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.rotate(degreeToRadian(90));
        ctx.drawImage(prev, 0, canvas.width * -1);
      },
      secondRotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.translate(canvas.width, canvas.height);
        ctx.rotate(degreeToRadian(30));
        ctx.drawImage(prev, -1 * canvas.height, -1 * canvas.width);
      },
      secondCanvasDimensions: (defaultWidth, defaultHeight) => ({
        height: defaultWidth,
        width: defaultHeight,
      }),
      relativeRectangle: {
        x: 0.5 - magicWidth,
        y: 0.5,
        width: magicWidth,
        height: 0.5,
      },
    },
    {
      rotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.translate(canvas.width, 0);
        ctx.rotate(degreeToRadian(90));
        ctx.drawImage(prev, 0, 0);
      },
      secondRotation: (canvas, prev) => {
        const ctx = canvas.getContext('2d')!;
        ctx.rotate(degreeToRadian(30));
        ctx.drawImage(prev, 0, 0);
      },
      secondCanvasDimensions: (defaultWidth, defaultHeight) => {
        return {
          height: defaultWidth,
          width: defaultHeight,
        };
      },
      relativeRectangle: {
        x: 0.5 - magicWidth,
        y: 0.25,
        width: magicWidth,
        height: 0.5,
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
              clippingTriangle:
                i % 2 === 1 ? rightwardTriangle : leftwardTriangle,
              ...lookup[i],
            };
          })
      );

  function onProcessingFinish(
    { detail: partialCanvas }: { detail: HTMLCanvasElement },
    line: number,
    index: number
  ) {
    checks(isDefined(ctx), 'Canvas context must be available');
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
    dispatch('finish', canvas); // TODO: count how often and only emit last
  }
</script>

<svelte:options accessors />

<div aria-hidden="true" hidden>
  {#each allTriangleSetups as triangleSetups, line}
    {#each triangleSetups as setup, i}
      <strong>A{i}</strong>
      <TriangleProcessing
        options="{setup}"
        image="{setup.image}"
        clippingTriangle="{setup.clippingTriangle}"
        inputValues="{inputValues}"
        scalingFactor="{magicScale}"
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
