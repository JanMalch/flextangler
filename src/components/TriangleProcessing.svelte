<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import { drawImage, inClip } from '../drawing/utils';
  import { ORIGIN } from '../factories';
  import { magicHeight } from '../formulas/content';
  import type {
    InputValues,
    ProcessingOptions,
    RectangleDef,
    TriangleDef,
  } from '../types';

  export let rotation: ProcessingOptions['rotation'];
  export let relativeRectangle: ProcessingOptions['relativeRectangle'];

  export let image: HTMLImageElement;
  export let inputValues: InputValues;
  export let clippingTriangle: TriangleDef;

  /**
   * @deprecated remove from application
   */
  let showLines = false;

  const dispatch = createEventDispatcher();

  afterUpdate(() => redraw());

  function loadIntoTriangleCanvas(toTriangleCanvas: HTMLCanvasElement) {
    const ctx = toTriangleCanvas.getContext('2d')!;
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

  function loadIntoRotatedCanvas(
    toTriangleCanvas: HTMLCanvasElement,
    rotatedTriangleCanvas: HTMLCanvasElement
  ) {
    const ctx = rotatedTriangleCanvas.getContext('2d')!;
    ctx.save();
    rotation(rotatedTriangleCanvas, toTriangleCanvas);
    ctx.restore();
  }

  function loadIntoScaledCanvas(
    rotatedTriangleCanvas: HTMLCanvasElement,
    scaledRotatedTriangleCanvas: HTMLCanvasElement
  ) {
    const ctx = scaledRotatedTriangleCanvas.getContext('2d')!;
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

  function createCanvas(dimensions: RectangleDef): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    return canvas;
  }

  function redraw() {
    const toTriangleCanvas = createCanvas({
      width: inputValues.triangleBase,
      height: inputValues.triangleHeight * (magicHeight * 2),
    });
    const rotatedTriangleCanvas = createCanvas({
      height: inputValues.triangleBase,
      width: inputValues.triangleHeight * (magicHeight * 2),
    });
    const scaledRotatedTriangleCanvas = createCanvas({
      width: inputValues.triangleBase,
      height: inputValues.triangleHeight,
    });

    loadIntoTriangleCanvas(toTriangleCanvas);
    loadIntoRotatedCanvas(toTriangleCanvas, rotatedTriangleCanvas);
    loadIntoScaledCanvas(rotatedTriangleCanvas, scaledRotatedTriangleCanvas);
    dispatch('finish', scaledRotatedTriangleCanvas);
  }
</script>
