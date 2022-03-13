class Position {
  constructor(x = 0, y = 0, extra = false) {
    this.x = x
    this.y = y
    if (extra) {
      this.extra = new Position()
    }
  }

  setExtra(x = 0, y = 0) {
    this.extra.x = x
  }
}

class Particle {
  constructor(position, home, angle, radius, velocity) {
    this.position = position
    this.home = home
    this.angle = angle
    this.radius = radius
    this.velocity = velocity
  }
}

class Color {
  constructor(range = 160, speed = 30) {
    this.timer = 0
    this.range = range
    this.speed = speed
  }
}

export class Mesh {
  particles = []

  constructor({width, height}, modifier = 0.1) {
    this.maxDistance = Math.hypot(width, height)
    const x = this.maxDistance * modifier
    const y = x * Math.sqrt(3) / 2
    this.step = new Position(x, y)


    this.extra = 3
    this.cols = (width / this.step.x | 0) + this.extra
    this.rows = (height / this.step.y | 0) + this.extra

    this.offset = new Position(
      (width - (this.cols - 1) * this.step.x) / 2,
      (height - (this.rows - 1) * this.step.y) / 2,
      true,
    )

    this.offset.setExtra(this.step.x / 4)

    this.color = new Color(160, 60)

    this.createVertex()
    this.createTriangles()
  }

  createVertex() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const shiftX = i & 1 ? -this.offset.extra.x : this.offset.extra.x

        const x = j * this.step.x + this.offset.x + shiftX
        const y = i * this.step.y + this.offset.y
        const position = new Position(x, y)

        const home = new Position(x, y)
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * this.offset.extra.x / 2 + this.offset.extra.x
        const velocity = Math.random() * 2 - 1

        this.particles.push(
          new Particle(position, home, angle, radius, velocity),
        )
      }
    }
  }

  createTriangles() {
    this.triangles = []
    for (let y = 0; y < this.rows - 1; y++) {
      const vertices = []
      for (let x = 0; x < this.cols; x++) {
        let a = x + this.cols * (y + 1)
        let b = x + this.cols * y

        if (y & 1) {
          [a, b] = [b, a]
        }

        vertices.push(this.particles[a], this.particles[b])
      }

      for (let i = 0; i < vertices.length - 2; i++) {
        const [a, b, c] = [
          vertices[i].position,
          vertices[i + 1].position,
          vertices[i + 2].position,
        ]
        this.triangles.push({
          a, b, c,
        })
      }
    }
  }

  update(correction = 0) {
    this.updateParticles(correction)
    this.updateTriangles(correction)
  }

  updateParticles(correction = 0) {
    this.particles.forEach(particle => {
      const {home: {x, y}, radius, velocity} = particle
      particle.angle += velocity * correction
      particle.position.x = Math.cos(particle.angle) * radius + x
      particle.position.y = Math.sin(particle.angle) * radius + y
    })
  }

  updateTriangles(correction = 0) {
    this.color.timer = (this.color.timer + this.color.speed * correction) % 360
  }

  renderParticles(context) {
    context.fillStyle = `orange`
    this.particles.forEach(particle => {
      context.beginPath()
      context.arc(particle.position.x, particle.position.y, 1, 0, Math.PI * 2)
      context.fill()
    })
  }

  renderTriangles(context) {
    this.triangles.forEach(triangle => {
      const {a, b, c} = triangle

      const position = new Position(
        (a.x + b.x + c.x) / 3,
        (a.y + b.y + c.y) / 3,
      )
      const distance = Math.hypot(position.x, position.y)
      const hue = distance / this.maxDistance * this.color.range - this.color.timer // + / -  color change direction

      context.strokeStyle = `hsl(${hue}, 70%, 70%)`
      context.fillStyle = `hsl(${hue}, 85%, 50%)`

      context.beginPath()
      context.moveTo(a.x, a.y)
      context.lineTo(b.x, b.y)
      context.lineTo(c.x, c.y)
      context.closePath()

      context.fill()
      context.stroke()
    })
  }

  renderCurves(context) {
    this.triangles.forEach(triangle => {
      const {a, b, c} = triangle

      const position = new Position(
        (a.x + b.x + c.x) / 3,
        (a.y + b.y + c.y) / 3,
      )
      const distance = Math.hypot(position.x, position.y)
      const hue = distance / this.maxDistance * this.color.range - this.color.timer // + / -  color change direction

      context.strokeStyle = `hsl(${hue}, 70%, 70%)`
      context.fillStyle = `hsl(${hue}, 85%, 50%)`

      context.beginPath()
      context.moveTo(a.x, a.y)
      context.quadraticCurveTo(position.x, position.y, b.x, b.y)
      context.quadraticCurveTo(position.x, position.y, c.x, c.y)
      context.quadraticCurveTo(position.x, position.y, a.x, a.y)
      context.closePath()

      context.fill()
    })
  }

  renderTurbulence(context) {
    this.triangles.forEach(triangle => {
      const {a, b, c} = triangle

      const position = new Position(
        (a.x + b.x + c.x) / 3,
        (a.y + b.y + c.y) / 3,
      )
      const distance = Math.hypot(position.x, position.y)
      const hue = distance / this.maxDistance * this.color.range - this.color.timer // + / -  color change direction

      context.strokeStyle = `hsl(${hue}, 70%, 70%)`
      context.fillStyle = `hsl(${hue}, 85%, 50%)`

      context.beginPath()
      context.moveTo(a.x, a.y)
      context.lineTo(b.x, b.y)
      context.lineTo(c.x, c.y)
      context.closePath()

      // context.fill()
      context.stroke()

      const [AB, BC, CA] = [
        new Position(
          (a.x + b.x) / 2,
          (a.y + b.y) / 2,
        ),
        new Position(
          (b.x + c.x) / 2,
          (b.y + c.y) / 2,
        ),
        new Position(
          (c.x + a.x) / 2,
          (c.y + a.y) / 2,
        ),
      ]

      context.beginPath()
      context.moveTo(AB.x, AB.y)
      context.lineTo(BC.x, BC.y)
      context.lineTo(CA.x, CA.y)
      context.closePath()

      context.stroke()
    })
  }

  renderBranches(context) {
    this.triangles.forEach(triangle => {
      const {a, b, c} = triangle

      const position = new Position(
        (a.x + b.x + c.x) / 3,
        (a.y + b.y + c.y) / 3,
      )
      const distance = Math.hypot(position.x, position.y)
      const hue = distance / this.maxDistance * this.color.range - this.color.timer // + / -  color change direction

      context.strokeStyle = `hsl(${hue}, 70%, 70%)`
      context.fillStyle = `hsl(${hue + 100}, 85%, 50%)`

      context.beginPath()
      context.moveTo(a.x, a.y)
      // context.lineTo(b.x, b.y)
      context.lineTo(c.x, c.y)
      // context.closePath()
      context.stroke()

      const [AB, BC, CA] = [
        new Position(
          (a.x + b.x) / 2,
          (a.y + b.y) / 2,
        ),
        new Position(
          (b.x + c.x) / 2,
          (b.y + c.y) / 2,
        ),
        new Position(
          (c.x + a.x) / 2,
          (c.y + a.y) / 2,
        ),
      ]

      context.beginPath()
      context.moveTo(AB.x, AB.y)
      context.lineTo(CA.x, CA.y)
      context.stroke()


      context.beginPath()
      context.arc(AB.x, AB.y, 8, 0, Math.PI * 2)
      context.fill()


      context.beginPath()
      context.arc(BC.x, BC.y, 8, 0, Math.PI * 2)
      context.fill()


      context.beginPath()
      context.arc(CA.x, CA.y, 8, 0, Math.PI * 2)
      context.fill()
    })
  }

  renderCells(context) {
    this.triangles.forEach(triangle => {
      const {a, b, c} = triangle

      const position = new Position(
        (a.x + b.x + c.x) / 3,
        (a.y + b.y + c.y) / 3,
      )
      const distance = Math.hypot(position.x, position.y)
      const hue = distance / this.maxDistance * this.color.range - this.color.timer // + / -  color change direction

      context.strokeStyle = `hsl(${hue}, 70%, 70%)`
      context.fillStyle = `hsl(${hue + 100}, 85%, 50%)`

      context.beginPath()
      context.moveTo(a.x, a.y)
      context.lineTo(b.x, b.y)
      context.lineTo(c.x, c.y)
      context.closePath()
      context.stroke()

      const [AB, BC, CA] = [
        new Position(
          (a.x + b.x) / 2,
          (a.y + b.y) / 2,
        ),
        new Position(
          (b.x + c.x) / 2,
          (b.y + c.y) / 2,
        ),
        new Position(
          (c.x + a.x) / 2,
          (c.y + a.y) / 2,
        ),
      ]

      const dA = Math.hypot(AB.x - position.x, AB.y - position.y)
      const dB = Math.hypot(BC.x - position.x, BC.y - position.y)
      const dC = Math.hypot(CA.x - position.x, CA.y - position.y)

      const radius = Math.min(dA, dB, dC) / 2

      context.beginPath()
      context.arc(position.x, position.y, radius, 0, Math.PI * 2)
      context.fill()
    })
  }
}
