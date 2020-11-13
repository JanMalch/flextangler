<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { checks, isDefined } from 'ts-code-contracts';
  import { drawGlue } from '../drawing/glue';
  import { magicScale, magicHeight } from '../formulas/content';
  import { degreeToRadian } from '../formulas/math';
  import { upwardTriangle, downwardTriangle } from '../shapes';
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
    if (line === 3 && index === 5) {
      dispatch('finish', canvas);
    }
  }
</script>

<svelte:options accessors />

<div aria-hidden="true" hidden>
  {#each allTriangleSetups as triangleSetups, line}
    {#each triangleSetups as setup, i}
      <strong>A{i}</strong>
      <TriangleProcessing
        {...setup}
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
