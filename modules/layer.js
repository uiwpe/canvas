export class Layer {
  constructor(container) {
    container.appendChild(this.createLayer())
    const ratio = Math.ceil(devicePixelRatio)

    addEventListener('resize', () => this.fitToContainer(ratio), false)
    this.fitToContainer(ratio)
  }

  createLayer() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    return this.canvas
  }

  fitToContainer(ratio = 1) {
    this.canvas.width = this.canvas.offsetWidth * ratio
    this.canvas.height = this.canvas.offsetHeight * ratio
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }
}
