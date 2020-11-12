import { requires } from 'ts-code-contracts';
import type { NaturalImage, Rectangle } from '../types';

export function shortestSide(image: NaturalImage): number {
  requires(
    image.naturalHeight > 0,
    `Natural height must be greater than 0 but is ${image.naturalHeight}`
  );
  requires(
    image.naturalWidth > 0,
    `Natural width must be greater than 0 but is ${image.naturalWidth}`
  );
  return Math.min(image.naturalWidth, image.naturalHeight);
}

/**
 * Returns `true` if and only if the given image is landscape or squared.
 * @param image the image to test
 */
export function isLandscape(image: NaturalImage): boolean {
  return shortestSide(image) === image.naturalHeight;
}

/**
 * Returns `true` if and only if the given image is portrait or squared.
 * @param image the image to test
 */
export function isPortrait(image: NaturalImage): boolean {
  return shortestSide(image) === image.naturalWidth;
}

/**
 * Returns `true` if and only if the given image is squared.
 * @param image the image to test
 */
export function isSquared(image: NaturalImage): boolean {
  return image.naturalWidth === image.naturalHeight;
}

/**
 * Returns the dimensions to crop the largest square in the center.
 * `x` and `y` describe the top left coordinate in the original image.
 * @param image the image to crop from
 */
export function centerCropLargestSquare(image: NaturalImage): Rectangle {
  const widthAndHeight = shortestSide(image);
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;
  return {
    width: widthAndHeight,
    height: widthAndHeight,
    x: centerX - widthAndHeight / 2,
    y: centerY - widthAndHeight / 2,
  };
}
