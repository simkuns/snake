export default class Map {
  constructor(width = 24, height = 24) {
    this.width = width
    this.height = height
    this.data = Array.from({ length: width * height }).map((_, index) => (
      index % width === 0 || 
      index % width === width - 1 ||
      ~~(index / width) === 0 ||
      ~~(index / width) === height - 1
    ) ? 1 : 0)
    this.info = {
      0: 'ground',
      1: 'wall'
    }
  }
}
