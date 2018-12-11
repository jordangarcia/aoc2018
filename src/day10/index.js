const { readLines } = require('../utils/readLines')

const RE = /^position=<([-\s]?\d+), ([-\s]?\d+)> velocity=<([-\s]?\d+), ([-\s]?\d+)>$/

class Point {
  constructor({ x, y, dx, dy }) {
    this.x = Number(x)
    this.y = Number(y)
    this.dx = Number(dx)
    this.dy = Number(dy)
  }

  tick() {
    return new Point({
      x: this.x + this.dx,
      y: this.y + this.dy,
      dx: this.dx,
      dy: this.dy,
    })
  }
}

class Board {
  constructor(t = 0, points = []) {
    this.t = t
    this.points = []
    this.pointsMap = {}
    points.forEach(point => this.addPoint(point))
  }

  tick() {
    const newPoints = this.points.map(p => p.tick())
    return new Board(this.t + 1, newPoints)
  }

  minX() {
    let m = Infinity
    this.points.forEach(({ x }) => {
      if (x < m) m = x
    })
    return m
  }

  minY() {
    let m = Infinity
    this.points.forEach(({ y }) => {
      if (y < m) m = y
    })
    return m
  }

  maxY() {
    let m = -Infinity
    this.points.forEach(({ y }) => {
      if (y > m) m = y
    })
    return m
  }

  maxX() {
    let m = -Infinity
    this.points.forEach(({ x }) => {
      if (x > m) m = x
    })
    return m
  }

  getSize() {
    let maxX = this.maxX()
    let minX = this.minX()
    let minY = this.minY()
    let maxY = this.maxY()
    const size = (maxY - minY) * (maxY - minY)
    return size
  }

  print() {
    let maxX = this.maxX()
    let minX = this.minX()
    let minY = this.minY()
    let maxY = this.maxY()
    let a = ''
    for (let y = minY; y <= maxY; y++) {
      let vert = ''
      for (let x = minX; x <= maxX; x++) {
        vert += this.getPoint({ x, y }) ? '*' : ' '
      }
      a += `${vert}\n`
    }
    return a
  }

  addPoint(...args) {
    const p = new Point(...args)
    this.points.push(p)
    this.pointsMap[this.coordKey(p)] = p
  }

  getPoint(coord) {
    return this.pointsMap[this.coordKey(coord)]
  }

  coordKey({ x, y }) {
    return `${x}, ${y}`
  }
}

async function solve(input) {
  const board = new Board()
  for await (let line of readLines(input)) {
    const [_, x, y, dx, dy] = line.match(RE)
    board.addPoint({ x, y, dx, dy })
  }
  let b = board
  while (true) {
    const newB = b.tick()
    // when the size starts to increase the last one is the msg
    if (newB.getSize() > b.getSize()) {
      console.log(`t = ${b.t}`)
      console.log(b.print())
      break
    }
    b = newB
  }
}

async function main() {
  const input = `${__dirname}/input2.txt`
  await solve(input)
}

main()
