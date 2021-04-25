export default class Score {
  constructor() {
    this.el = document.createElement('span')
    this.el.classList.toggle('score', true)
    document.body.appendChild(this.el)

    this.reset()
  }

  /**
   * Update score
   * @param {Number} value 
   */
  update(value) {
    this.value = value
    this.el.innerHTML = this.value
  }

  reset() {
    this.update(0)
  }
}
