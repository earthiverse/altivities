/**
 * NOTE: `min` and `max` are included in the interval range.
 *
 * @param min
 * @param max
 * @returns A random number in the interval
 */
export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
