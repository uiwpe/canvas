export class Loop {
  name

  constructor(update, display) {
    this.update = update
    this.display = display
    this.deltaTime = 0
    this.lastUpdate = 0
    this.maxInteval = 100

    this.id = requestAnimationFrame(stampTime => this.animate(stampTime))
  }

  cancel() {
    if (this.id) {
      cancelAnimationFrame(this.id)
    }
  }

  animate(currentTime) {
    this.id = requestAnimationFrame(stampTime => this.animate(stampTime))

    this.deltaTime = currentTime - this.lastUpdate
    if (this.deltaTime < this.maxInteval) {
      this.update(this.deltaTime / 1000)
      this.display(this.name)
    }

    this.lastUpdate = currentTime
  }
}
