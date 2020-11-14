import { ORIGIN } from '../factories';
import { magicHeight } from '../formulas/content';
import { degreeToRadian } from '../formulas/math';
import type { InputValues, NaturalImage, ProcessingOptions, Rectangle, RectangleDef, TriangleDef } from '../types';
import { drawImage, inClip } from './utils';

/**
 * Options to find and rotate the individual triangles in the hexagon from the image.
 */
export const triangleSelectors: ProcessingOptions[] = [
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

function loadIntoTriangleCanvas(
  toTriangleCanvas: HTMLCanvasElement,
  image: NaturalImage & CanvasImageSource,
  clippingTriangle: TriangleDef,
  relativeRectangle: Rectangle
) {
  const ctx = toTriangleCanvas.getContext('2d')!;
  ctx.clearRect(0, 0, toTriangleCanvas.width, toTriangleCanvas.height);
  ctx.save();

  inClip(
    ctx,
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
  rotatedTriangleCanvas: HTMLCanvasElement,
  rotation: ProcessingOptions["rotation"]
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

export function extractRotatedTriangle(inputValues: InputValues,
                       image: NaturalImage & CanvasImageSource,
                       clippingTriangle: TriangleDef,
                       relativeRectangle: Rectangle,
                       rotation: ProcessingOptions["rotation"]) {
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

  loadIntoTriangleCanvas(toTriangleCanvas, image, clippingTriangle, relativeRectangle);
  loadIntoRotatedCanvas(toTriangleCanvas, rotatedTriangleCanvas, rotation);
  loadIntoScaledCanvas(rotatedTriangleCanvas, scaledRotatedTriangleCanvas);
  return scaledRotatedTriangleCanvas;
}
