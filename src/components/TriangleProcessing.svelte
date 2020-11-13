<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import { drawImage, inClip } from '../drawing/utils';
  import { ORIGIN } from '../factories';
  import { magicWidth } from '../formulas/content';
  import type { InputValues, ProcessingOptions, TriangleDef } from '../types';

  export let options: ProcessingOptions;

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
  let fullRotatedTriangleCanvas: HTMLCanvasElement; //  | null = null;
  let scaledRotatedTriangleCanvas: HTMLCanvasElement; //  | null = null;

  $: secondCanvasDimensions =
    options?.secondCanvasDimensions ??
    (((width, height) => ({ width, height })) as NonNullable<
      ProcessingOptions['secondCanvasDimensions']
    >);

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
            x: options.relativeRectangle.x * image.naturalWidth,
            y: options.relativeRectangle.y * image.naturalHeight,
            width: options.relativeRectangle.width * image.naturalWidth,
            height: options.relativeRectangle.height * image.naturalHeight,
          }
        );
      }
    );

    ctx.restore();
  }

  function loadIntoRotatedCanvas() {
    const ctx = rotatedTriangleCanvas!.getContext('2d')!;
    ctx.save();
    if (options.rotation) {
      options.rotation(rotatedTriangleCanvas, toTriangleCanvas);
    } else {
      ctx.drawImage(toTriangleCanvas, 0, 0);
    }
    ctx.restore();
  }

  function loadIntoFullRotatedCanvas() {
    const ctx = fullRotatedTriangleCanvas!.getContext('2d')!;
    ctx.save();
    if (options.secondRotation) {
      options.secondRotation(fullRotatedTriangleCanvas, rotatedTriangleCanvas);
    } else {
      ctx.drawImage(rotatedTriangleCanvas, 0, 0);
    }
    ctx.restore();
  }

  function loadIntoScaledCanvas() {
    const ctx = scaledRotatedTriangleCanvas!.getContext('2d')!;
    ctx.save();
    drawImage(
      ctx,
      ORIGIN,
      fullRotatedTriangleCanvas,
      {
        x: 0,
        y: 0,
        width: scaledRotatedTriangleCanvas.width,
        height: scaledRotatedTriangleCanvas.height,
      },

      {
        x: 0,
        y: 0,
        width: fullRotatedTriangleCanvas.width,
        height: fullRotatedTriangleCanvas.height,
      }
    );
    ctx.restore();
  }

  function redraw() {
    loadIntoTriangleCanvas();
    loadIntoRotatedCanvas();
    loadIntoFullRotatedCanvas();
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
      height="{inputValues.triangleHeight}"
      width="{inputValues.triangleBase * (magicWidth * 2)}"></canvas>
  </div>
  <div>
    <b>rotatedTriangleCanvas ({rotatedTriangleCanvas?.width.toFixed(2)}
      &times;
      {rotatedTriangleCanvas?.height.toFixed(2)})</b>
    <canvas
      bind:this="{rotatedTriangleCanvas}"
      height="{secondCanvasDimensions(inputValues.triangleBase * (magicWidth * 2), inputValues.triangleHeight).height}"
      width="{secondCanvasDimensions(inputValues.triangleBase * (magicWidth * 2), inputValues.triangleHeight).width}"></canvas>
  </div>
  <div>
    <b>fullRotatedTriangleCanvas ({fullRotatedTriangleCanvas?.width.toFixed(2)}
      &times;
      {fullRotatedTriangleCanvas?.height.toFixed(2)})</b>
    <canvas
      bind:this="{fullRotatedTriangleCanvas}"
      height="{inputValues.triangleHeight}"
      width="{inputValues.triangleBase * (magicWidth * 2)}"></canvas>
  </div>
  <div>
    <b>scaledRotatedTriangleCanvas ({scaledRotatedTriangleCanvas?.width.toFixed(2)}
      &times;
      {scaledRotatedTriangleCanvas?.height.toFixed(2)})</b>
    <canvas
      bind:this="{scaledRotatedTriangleCanvas}"
      height="{inputValues.triangleHeight}"
      width="{inputValues.triangleBase * (magicWidth * 2) * scalingFactor}"></canvas>
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
