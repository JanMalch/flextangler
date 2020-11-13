<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import { drawImage, inClip } from '../drawing/utils';
  import { ORIGIN } from '../factories';
  import { magicHeight } from '../formulas/content';
  import type { InputValues, ProcessingOptions, TriangleDef } from '../types';

  export let rotation: ProcessingOptions['rotation'];
  export let relativeRectangle: ProcessingOptions['relativeRectangle'];

  export let image: HTMLImageElement;
  export let inputValues: InputValues;
  export let scalingFactor: number;
  export let clippingTriangle: TriangleDef;

  /**
   * @deprecated remove from application
   */
  let showLines = false;

  let toTriangleCanvas: HTMLCanvasElement; //  | null = null;
  let rotatedTriangleCanvas: HTMLCanvasElement; //  | null = null;
  let scaledRotatedTriangleCanvas: HTMLCanvasElement; //  | null = null;

  const dispatch = createEventDispatcher();

  afterUpdate(() => redraw());

  function loadIntoTriangleCanvas() {
    const ctx = toTriangleCanvas!.getContext('2d')!;
    ctx.clearRect(0, 0, toTriangleCanvas.width, toTriangleCanvas.height);
    ctx.save();

    inClip(
      ctx,
      showLines,
      ORIGIN,
      clippingTriangle.map((point) => ({
        x: point.x * toTriangleCanvas.width,
        y: point.y * toTriangleCanvas.height,
      })),
      () => {
        drawImage(
          ctx,
          ORIGIN,
          image,
          {
            x: 0,
            y: 0,
            width: toTriangleCanvas.width,
            height: toTriangleCanvas.height,
          },
          {
            x: relativeRectangle.x * image.naturalWidth,
            y: relativeRectangle.y * image.naturalHeight,
            width: relativeRectangle.width * image.naturalWidth,
            height: relativeRectangle.height * image.naturalHeight,
          }
        );
      }
    );

    ctx.restore();
  }

  function loadIntoRotatedCanvas() {
    const ctx = rotatedTriangleCanvas!.getContext('2d')!;
    ctx.save();
    rotation(rotatedTriangleCanvas, toTriangleCanvas);
    ctx.restore();
  }

  function loadIntoScaledCanvas() {
    const ctx = scaledRotatedTriangleCanvas!.getContext('2d')!;
    ctx.save();
    drawImage(
      ctx,
      ORIGIN,
      rotatedTriangleCanvas,
      {
        x: 0,
        y: 0,
        width: scaledRotatedTriangleCanvas.width,
        height: scaledRotatedTriangleCanvas.height,
      },

      {
        x: 0,
        y: 0,
        width: rotatedTriangleCanvas.width,
        height: rotatedTriangleCanvas.height,
      }
    );
    ctx.restore();
  }

  function redraw() {
    loadIntoTriangleCanvas();
    loadIntoRotatedCanvas();
    loadIntoScaledCanvas();
    dispatch('finish', scaledRotatedTriangleCanvas);
  }
</script>

<section>
  <div>
    <b>toTriangleCanvas ({toTriangleCanvas?.width.toFixed(2)}
      &times;
      {toTriangleCanvas?.height.toFixed(2)})</b>
    <canvas
      bind:this="{toTriangleCanvas}"
      height="{inputValues.triangleHeight * (magicHeight * 2)}"
      width="{inputValues.triangleBase}"></canvas>
  </div>
  <div>
    <b>rotatedTriangleCanvas ({rotatedTriangleCanvas?.width.toFixed(2)}
      &times;
      {rotatedTriangleCanvas?.height.toFixed(2)})</b>
    <canvas
      bind:this="{rotatedTriangleCanvas}"
      height="{inputValues.triangleBase}"
      width="{inputValues.triangleHeight * (magicHeight * 2)}"></canvas>
  </div>
  <div>
    <b>scaledRotatedTriangleCanvas ({scaledRotatedTriangleCanvas?.width.toFixed(2)}
      &times;
      {scaledRotatedTriangleCanvas?.height.toFixed(2)})</b>
    <canvas
      bind:this="{scaledRotatedTriangleCanvas}"
      height="{inputValues.triangleBase}"
      width="{inputValues.triangleHeight * (magicHeight * 2) * scalingFactor}"></canvas>
  </div>
</section>

<style>
  section {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 32px;
  }

  b {
    display: block;
  }

  canvas {
    border: 1px solid #444;
    background-color: #eeeeee;
  }
</style>
