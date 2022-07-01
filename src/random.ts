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
