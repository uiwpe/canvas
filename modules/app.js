import {Layer} from './layer.js'
import {Loop} from './loop.js'
import {Mesh} from './mesh.js'

class App {
  constructor(container, name) {
    this.layer = new Layer(container)
    addEventListener('resize', () => {
      this.createMesh()
    })
    this.createMesh()
    this.loop = new Loop(time => this.update(time), () => this.display(name))
  }

  refresh(name) {
    this.loop.cancel()
    console.log(name)
    this.loop = new Loop(time => this.update(time), () => this.display(name))
  }

  createMesh() {
    this.mesh = new Mesh(this.layer, 0.075)
  }

  update(correction = 0) {
    this.mesh.update(correction)
  }

  display(name) {
    this.layer.context.canvas.width |= 0
    switch (name) {
      case 'cells': {
        this.mesh.renderCells(this.layer.context)
        break
      }
      case 'branches': {
        this.mesh.renderBranches(this.layer.context)
        break
      }
      case 'turbulence': {
        this.mesh.renderTurbulence(this.layer.context)
        break
      }
      case 'curves': {
        this.mesh.renderCurves(this.layer.context)
        break
      }
      case 'triangles': {
        this.mesh.renderTriangles(this.layer.context)
        break
      }
      default: {
        this.mesh.renderParticles(this.layer.context)
      }
    }
    // this.mesh.renderCells(this.layer.context)
    // this.mesh.renderBranches(this.layer.context)
    // this.mesh.renderTurbulence(this.layer.context)
    // this.mesh.renderCurves(this.layer.context)
    // this.mesh.renderTriangles(this.layer.context)
    // this.mesh.renderParticles(this.layer.context)
  }
}

onload = () => {
  const meshes = [
    'cells',
    'branches',
    'turbulence',
    'curves',
    'triangles'
  ]

  let i = 0
  const app = new App(document.body)

  setInterval(() => {
    i = (i + 1) % meshes.length
    app.refresh(meshes[i])
  }, 4200)
}
