import type { StyleValue } from "vue";

/**
 * Returns an integer in the range [min, max].
 *
 * @param min
 * @param max
 * @returns A random number in the interval
 */
export function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Returns a float in the range [min, max).
 *
 * @param min
 * @param max
 * @param decimals
 * @returns
 */
export function randomFloatFromInterval(
  min: number,
  max: number,
  decimals = 3
): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function randomTransformStyle(): StyleValue {
  const rotation = randomIntFromInterval(0, 2 * Math.PI);
  const scale = randomFloatFromInterval(0.5, 1);
  return {
    transform: `rotate(${rotation}rad) ` + `scale(${scale}) `,
    WebkitFilter: `drop-shadow(0 0 10px rgba(255, 255, 255, 5))`,
    filter: `drop-shadow(0 0 10px rgba(255, 255, 255, 5))`,
  };
}
