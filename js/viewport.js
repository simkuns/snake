import { diagonal, deg2rad } from './utils'

export default class Viewport {
  constructor(options) {
    const {
      width,
      height,
      x = 0,
      y = 0,
      scale = 32 // 1 map unit = 32px (viewport units)
    } = options

    this.x = x
    this.y = y
    this.scale = scale

    this.el = document.createElement('canvas')
    this.context = this.el.getContext('2d')

    this._angle = 0 // todo: camera
    this.angle = 0 // todo: camera

    this.resize(width, height)
  }

  resize(width, height) {
    this.width = width
    this.height = height

    this.el.width = width
    this.el.height = height

    this.diagonal = diagonal(width, height)
  }

  moveTo(x, y) {
    this.x = x
    this.y = y
  }

  scrollTo(x, y) {
    this.x += (x - this.x) * 0.05
    this.y += (y - this.y) * 0.05
  }


  // /**
  //  * Draw on viewport
  //  * @param {function(CanvasRenderingContext2D): void} [callback]
  //  */
  // draw(callback = (ctx) => {}) {
  //   const ctx = this.context
  //   ctx.save()
  //   // start at center
  //   ctx.translate(
  //     ~~(this.width * 0.5),
  //     ~~(this.height * 0.5)
  //   )
  //   // rotate to current angle
  //   ctx.rotate(
  //     deg2rad(this.angle + this._angle)
  //   )
  //   // move back to correct location
  //   ctx.translate(
  //     ~~(-this.x - this.scale * 0.5),
  //     ~~(-this.y - this.scale * 0.5)
  //   )
  //   callback.call(this, ctx)
  //   ctx.restore()
  // }

  // // helper methods used as callbacks for draw()
  // drawTile(x, y, color) {
  //   this.draw((ctx) => {
  //     ctx.fillStyle = color
  //     ctx.translate(
  //       ~~(x * this.scale),
  //       ~~(y * this.scale)
  //     )
  //     ctx.fillRect(0, 0, this.scale, this.scale)
  //   })
  //   // const ctx = this.context
  // }

  clear(color = 'rgba(0, 0, 0, 0)') {
    const ctx = this.context
    ctx.imageSmoothingEnabled = false
    ctx.save()
    ctx.fillStyle = color
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.restore()
  }

  /**
   * Creates offscreen canvas.
   * 
   * @param {Number} width 
   * @param {Number} height 
   * @param {function(CanvasRenderingContext2D)} updateBufferCallback 
   * @returns 
   */
  createBufferContext(width, height, updateBufferCallback) {
    const viewport = this
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    return {
      updateBuffer() {
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.scale(viewport.scale, viewport.scale)
        updateBufferCallback(ctx)
        ctx.restore()
      },
      drawFromBuffer() {
        const ctx = viewport.context
        ctx.save()
        // start at center
        ctx.translate(
          ~~(viewport.width * 0.5),
          ~~(viewport.height * 0.5)
        )
        // rotate to current angle
        ctx.rotate(
          deg2rad(viewport.angle + viewport._angle)
        )
        // move back to correct location
        ctx.translate(
          ~~(-viewport.x - viewport.scale * 0.5),
          ~~(-viewport.y - viewport.scale * 0.5)
        )
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height)
        ctx.restore()
      }
    }
  }
}