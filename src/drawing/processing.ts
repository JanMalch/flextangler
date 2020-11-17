import { magicSize } from '../formulas/content';
import { degreeToRadian } from '../formulas/math';
import type { NaturalImage, ProcessingOptions, Rectangle, RectangleDef, TriangleDef } from '../types';
import { drawImage, inClip } from './utils';

/**
 * Options to find and rotate the individual triangles in the hexagon from the image.
 * The hexagon is rotated so that the flat sides face up- or downwards.
 */
export const triangleSelectors: ProcessingOptions[] = [
  {
    // A0
    relativeRectangle: {
      x: 0,
      y: 0.5,
      width: 0.5,
      height: magicSize,
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
      y: 0.5 - magicSize,
      width: 0.5,
      height: magicSize,
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
      y: 0.5 - magicSize,
      width: 0.5,
      height: magicSize,
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
      y: 0.5 - magicSize,
      width: 0.5,
      height: magicSize,
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
      height: magicSize,
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
      height: magicSize,
    },
  },
];

/**
 * Options to find and rotate the individual triangles in the hexagon from the image.
 * The hexagon is rotated so that the flat sides face to the left or right.
 */
export const triangleSelectorsFlatSides: ProcessingOptions[] = [
  {
    // A0
    relativeRectangle: {
      x: 0.5 - magicSize,
      y: 0,
      width: magicSize,
      height: 0.5,
    },
    rotation: (canvas, prev) => {
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(prev, 0, 0);
    },
  },
  {
    // A1
    relativeRectangle: {
      x: 0.5,
      y: 0,
      width: magicSize,
      height: 0.5,
    },
    rotation: (canvas, prev) => {
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(prev, 0, 0);
    },
  },
  {
    // A2
    rotation: (canvas, prev) => {
      const ctx = canvas.getContext('2d')!;
      ctx.translate(0, canvas.height / 2);
      ctx.rotate(degreeToRadian(-120));
      ctx.drawImage(prev, canvas.width * -1, 0);
    },
    relativeRectangle: {
      x: 0.5,
      y: 0.25,
      width: magicSize,
      height: 0.5,
    },
  },
  {
    // A3
    rotation: (canvas, prev) => {
      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvas.width, canvas.height / 2);
      ctx.rotate(degreeToRadian(-120));
      ctx.drawImage(prev, 0, canvas.height * -1);
    },
    relativeRectangle: {
      x: 0.5,
      y: 0.5,
      width: magicSize,
      height: 0.5,
    },
  },
  {
    // A4
    rotation: (canvas, prev) => {
      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvas.width, 0);
      ctx.rotate(degreeToRadian(120));
      ctx.drawImage(prev, 0, canvas.height / -2);
    },
    relativeRectangle: {
      x: 0.5 - magicSize,
      y: 0.5,
      width: magicSize,
      height: 0.5,
    },
  },
  {
    // A5
    rotation: (canvas, prev) => {
      const ctx = canvas.getContext('2d')!;
      ctx.rotate(degreeToRadian(120));
      ctx.drawImage(prev, 0, canvas.height * -1);
    },
    relativeRectangle: {
      x: 0.5 - magicSize,
      y: 0.25,
      width: magicSize,
      height: 0.5,
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
    clippingTriangle.map((point) => ({
      x: point.x * toTriangleCanvas.width,
      y: point.y * toTriangleCanvas.height,
    })),
    () => {
      drawImage(
        ctx,
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

export function extractRotatedTriangle(size: number,
                       image: NaturalImage & CanvasImageSource,
                       clippingTriangle: TriangleDef,
                       relativeRectangle: Rectangle,
                       rotation: ProcessingOptions["rotation"],
                       pointyBottom: boolean) {
  const smallerSize = size * (magicSize * 2);
  const toTriangleCanvas = createCanvas({
    width: pointyBottom ? smallerSize : size,
    height: pointyBottom ? size : smallerSize,
  });
  const rotatedTriangleCanvas = createCanvas({
    height: size,
    width: smallerSize,
  });
  const scaledRotatedTriangleCanvas = createCanvas({
    width: size,
    height: size,
  });

  loadIntoTriangleCanvas(toTriangleCanvas, image, clippingTriangle, relativeRectangle);
  loadIntoRotatedCanvas(toTriangleCanvas, rotatedTriangleCanvas, rotation);
  loadIntoScaledCanvas(rotatedTriangleCanvas, scaledRotatedTriangleCanvas);
  return scaledRotatedTriangleCanvas;
}
