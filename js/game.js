import Snake from './snake'
import Map from './map'
import Score from './score'
import Viewport from './viewport'
import palettes from './palette'
import { sin, cos, foodLocator } from './utils'

let palette_index // todo
let snake_direction // todo
let food = [
  { x: 12, y: 4 }
] // todo
let snake_moves = [] // todo
const executor = (fn) => fn()

export default class Game {
  constructor() {
    this.score = new Score()
    this.snake = new Snake()
    this.map = new Map()
    this.viewport = new Viewport({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      scale: (document.documentElement.clientWidth < 768) ? 24 : 32
    })

    this.init()
  }

  /**
   * Resets game internal state
   */
  reset() {
    palette_index = Math.floor(Math.random() * palettes.length)
    snake_direction = 90
    snake_moves = []

    this.viewport._angle = this.viewport.angle
    this.viewport.angle = 0
  
    this.snake.body = Snake.generate({
      length: 5,
      direction: snake_direction,
      head: { 
        x: ~~(this.map.width * 0.5), 
        y: ~~(this.map.height * 0.5)
      }
    })
    
    this.score.reset()
  }

  /**
   * Set initial state
   * Create rendering functions
   */
  init() {
    document.body.appendChild(this.viewport.el)
    this.reset()


    this.renderFns = []

    // track snake head
    this.renderFns.push(() => {
      this.viewport.scrollTo(
        this.snake.body[0].x * this.viewport.scale,
        this.snake.body[0].y * this.viewport.scale
      )
      this.viewport._angle = this.viewport._angle - this.viewport._angle * 0.1
    })

    const mapBufferContext = this.viewport.createBufferContext(
      this.map.width * this.viewport.scale,
      this.map.height * this.viewport.scale,
      (ctx) => {
        this.map.data.forEach((tile, index) => {
          const tileName = this.map.info[ tile ]
          ctx.fillStyle = palettes[palette_index][ tileName ]
          ctx.fillRect(
            (index % this.map.width),
            ~~(index / this.map.width),
            1,
            1
          )
        })
      }
    )
    mapBufferContext.updateBuffer()
    this.renderFns.push(mapBufferContext.drawFromBuffer)

    const snakeBufferContext = this.viewport.createBufferContext(
      this.map.width * this.viewport.scale,
      this.map.height * this.viewport.scale,
      (ctx) => {
        ctx.fillStyle = palettes[palette_index].snake
        for (let i = 0; i < this.snake.body.length; i++) {
          ctx.fillRect(this.snake.body[i].x, this.snake.body[i].y, 1, 1)
        }
      }
    )
    snakeBufferContext.updateBuffer()
    this.renderFns.push(snakeBufferContext.drawFromBuffer)

    const foodBufferContext = this.viewport.createBufferContext(
      this.map.width * this.viewport.scale,
      this.map.height * this.viewport.scale,
      (ctx) => {
        ctx.fillStyle = palettes[palette_index].food
        for (let i = 0; i < food.length; i++) {
          ctx.fillRect(food[i].x, food[i].y, 1, 1)
        }
      }
    )
    foodBufferContext.updateBuffer()
    this.renderFns.push(foodBufferContext.drawFromBuffer)



    this.updateFns = []

    // move snake
    this.updateFns.push(() => {
      const move = snake_moves.shift()
      switch (move) {
        case -1:
          snake_direction -= 90
          break;
        case 1:
          snake_direction += 90
          break;
      }   
      const head = game.snake.body.pop()
      head.x = this.snake.body[0].x - 1 * cos(snake_direction)
      head.y = this.snake.body[0].y - 1 * sin(snake_direction)

      this.snake.body.unshift(head)
    })

    // update snake paint buffer
    this.updateFns.push(snakeBufferContext.updateBuffer)

    // check collision of snake head against map wall
    this.updateFns.push(() => {
      if (this.map.data[this.snake.body[0].y * this.map.width + this.snake.body[0].x] === 1) {
        this.reset()
      }
    })

    // collision of snake head against its body
    this.updateFns.push(() => {
      for (let i = 1; i < this.snake.body.length; i++) {
        if (this.snake.body[0].x === this.snake.body[i].x && this.snake.body[0].y === this.snake.body[i].y) {
          this.reset()
          break
        }
      }
    })

    // collision of snake head against food
    this.updateFns.push(() => {
      for (let i = 0; i < food.length; i++) {
        if (food[i] !== undefined && this.snake.body[0].x === food[i].x && this.snake.body[0].y === food[i].y) {
          this.snake.body.push(
            food.splice(i, 1)[0]
          ) // add to tail, this will be new head on next update
          this.score.update(this.score.value + 1)
          foodBufferContext.updateBuffer()
          break
        }
      }
    })

    // todo: add events
    // add food when there is no food
    const locator = foodLocator(this.map)
    this.updateFns.push(() => {
      if (!food.length) {
        const edible = locator.getPoint(this.snake)
        if (typeof edible !== 'object') return // todo: endgame victory
        food.push(edible)
        foodBufferContext.updateBuffer()
      }
    })
  }

  render() {
    this.viewport.clear(palettes[palette_index].void)
    this.renderFns.forEach(executor)
  }

  update() {
    this.updateFns.forEach(executor)
  }

  run() {
    // the game loop
    let lastUpdated = performance.now()
    const loop = () => {
      window.requestAnimationFrame(loop)

      const now = performance.now()
      if (250 < now - lastUpdated) {
        this.update()
        lastUpdated = now
      }

      this.render()
    }
    loop()
  }
}

const game = new Game()

// show instructions and run game on input
window.addEventListener('load', () => {
  game.viewport.moveTo(
    game.snake.body[0].x * game.viewport.scale,
    game.snake.body[0].y * game.viewport.scale
  )
  game.render()

  new Promise((resolve) => {
    const el = document.createElement('div')
    el.id = 'instructions'
    el.innerHTML = `Tap to start`
    document.body.appendChild(el)
    function eventhandler() {
      el.parentElement && el.parentElement.removeChild(el)
      resolve()
      // loop() // start the game
      game.run()
    }
    window.addEventListener('keydown', eventhandler, { once: true })
    // window.addEventListener('click', eventhandler, { once: true })
    window.addEventListener('touchstart', eventhandler, { once: true })
  }).then(() => {
    ;['left', 'right']
      .map((id) => {
        const el = document.createElement('section')
        el.id = id
        return el
      })
      .forEach((el) => {
        document.body.appendChild(el)
      })

    const el = document.createElement('div')
    el.id = 'instructions'
    el.innerHTML = `<span>Tap to change direction</span>`
    document.body.appendChild(el)
    function eventhandler() {
      el.parentElement && el.parentElement.removeChild(el)
    }
    window.addEventListener('keydown', eventhandler, { once: true })
    // window.addEventListener('click', eventhandler, { once: true })
    window.addEventListener('touchstart', eventhandler, { once: true })
  })
}, { once: true })
// loop()

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.viewport.angle += 90
      game.viewport._angle -= 90
      snake_moves.push(-1)
      break
    case 'ArrowRight':
      game.viewport.angle -= 90
      game.viewport._angle += 90
      snake_moves.push(1)
      break
  }
})

window.addEventListener('touchstart', (e) => {
  switch (e.target.id) {
    case 'left':
      game.viewport.angle += 90
      game.viewport._angle -= 90
      snake_moves.push(-1)
      break
    case 'right':
      game.viewport.angle -= 90
      game.viewport._angle += 90
      snake_moves.push(1)
      break
  }

  if (!e.target.classList.contains('clicked')) {
    e.target.classList.add('clicked')
    setTimeout(() => {
      e.target.classList.remove('clicked')
    }, 100)
  }
})
window.addEventListener('resize', () => {
  game.viewport.resize(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  )
  game.render()
})
;[
  'gesturestart',
  'gesturechange',
  'gestureend',
  'touchstart',
  'touchchange',
  'touchend',
  'touchtouchcancel',
].map((type) => window.addEventListener(type, (e) => e.preventDefault()))
