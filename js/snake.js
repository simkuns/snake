import { sin, cos } from './utils'

/**
 * @typedef Point2D
 * @param {Number} x
 * @param {Number} y
 */

export default class Snake {
  constructor() {
    /** @property {Array<Point2D>} body */
    this.body = []
  }

  /**
   * @method generate Create a new snake body
   * 
   * @param {Object} options
   * @param {Number} options.length Snake body size.
   * @param {Number} [options.direction] Straight angle in degrees.
   *    Grows tail in given direction.
   *    0 degrees is right or east, 90 degrees is up or north.
   * @param {Point2D} [options.head] Starting position.
   * 
   * @returns {Array<Point2D>}
   */
  static generate(options) {
    const {
      length,
      direction = 0,
      head = {
        x: 0,
        y: 0
      }
    } = options

    // be careful when rounding integers, Math.floor(-1e-100) = -1
    return Array.from({ length })
      .map((_, index) => ({
        x: head.x + index * cos(direction),
        y: head.y + index * sin(direction)
      }))
  }
}
