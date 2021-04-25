/**
 * @typedef Point2D
 * @param {Number} x
 * @param {Number} y
 */

/**
 * Convert angle in degrees to radians
 * @param {Number} degrees 
 * @returns {Number} radians
 */
export function deg2rad(degrees = 0) {
  return degrees * Math.PI / 180
}

/**
 * @param {Number} width 
 * @param {Number} height
 * @returns {Number} Diagonal length of rectangle
 */
export function diagonal(width = 0, height = 0) {
  return Math.floor(Math.sqrt(width ** 2 + height ** 2))
}


const sin_table = Array.from({ length: 720 / 90 })
  .map((_, index) => {
    const angle = -360 + 90 * index
    return [
      angle,
      Math.round(Math.sin(deg2rad(angle)))
    ]
  })
  .reduce((o, [key, value]) => {
    o[key] = value
    return o
  }, {})

/**
 * Fast sine for straight angles.
 * @param {Number} angle 
 * @returns {Number} -1|0|1
 */
export function sin(angle) {
  return sin_table[ angle % 360 ]
}

const cos_table = Array.from({ length: 720 / 90 })
  .map((_, index) => {
    const angle = -360 + 90 * index
    return [
      angle,
      Math.round(Math.cos(deg2rad(angle)))
    ]
  })
  .reduce((o, [key, value]) => {
    o[key] = value
    return o
  }, {})

/**
 * Fast cosine for straight angles.
 * @param {Number} angle 
 * @returns {Number} -1|0|1
 */
export function cos(angle) {
  return cos_table[ angle % 360 ]
}

export function foodLocator(map) {
  function getUnoccupied(snake) {
    let data = [ ...map.data ] // copy map data
    snake.body.forEach((point) => data[point.x + point.y * map.width] = 1) // snake is wall now

    return data.map((value, index) => ({
      value,
      x: index % map.width,
      y: ~~(index / map.width)
    })).filter((point) => point.value === 0)
  }

  return {
    /**
     * @param {Snake} snake 
     */
    getPoint(snake) {
      const unoccupied = getUnoccupied(snake)
      return unoccupied[ ~~(Math.random() * unoccupied.length) ]
    }
  }
}
