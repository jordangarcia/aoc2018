const fs = require('fs')
const _ = require('lodash')
const { readLines } = require('../utils/readLines')

function manhattanDistance([x1, y1], [x2, y2]) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}

function max(arr) {
  let maxX = -Infinity
  let maxY = -Infinity

  arr.forEach(({ coord }) => {
    const [x, y] = coord
    if (x > maxX) {
      maxX = x
    }

    if (y > maxY) {
      maxY = y
    }
  })

  return [maxX, maxY]
}

function perm([x, y]) {
  const a = [[x, y], [x, -y], [-x, -y], [-x, y]]

  return _.uniqBy(a, ([x, y]) => `${x},${y}`)
}

function iterRadius([x, y], r) {
  // 1 -> [1, 0], [0, 1], [-1, 0], [0, -1]
  // 2 -> [2, 0], [0, 2], [-2, 0], [0, -2], [-1, -1], [1, -1], [1, 1], [-1, 1]
  // 3 -> [3, 0], [0, 3], [-3, 0], [0, -2], [-1, -1]
  const xforms = []
  for (let i = 0; i < r; i++) {
    const diff = r - i

    for (let coord of perm([i, diff])) {
      xforms.push(coord)
    }
    for (let coord of perm([diff, i])) {
      xforms.push(coord)
    }
  }
  return _.uniqBy(xforms, ([x, y]) => `${x},${y}`)
}

const add = ([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2]

function addToBoard(arr, [x, y], char) {
  if (!arr[x]) {
    arr[x] = []
  }
  arr[x][y] = char
  return arr
}

function printBoard(board) {
  console.tab
}

const outOfBounds = ([x, y]) => x >= 0 && y >= 0

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
console.log(alphabet.length)

function check(inputs, [x, y]) {
  let mark
  const res = inputs.map(({ coord, letter }) => {
    return {
      letter,
      distance: manhattanDistance(coord, [x, y]),
    }
  })

  const [first, second] = _.sortBy(res, a => a.distance, 'asc')
  if (first.distance === second.distance) {
    return null
  } else {
    return first.letter
  }
}

async function solve(input) {
  const lines = []
  for await (let line of readLines(input)) {
    lines.push(line)
  }

  const inputs = lines.map((line, ind) => {
    const [_, x, y] = line.match(/(\d+), (\d+)/)
    return { letter: ind, coord: [Number(x), Number(y)] }
  })

  const [maxX, maxY] = max(inputs)
  const infinites = new Set()
  let counts = []

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      const res = check(inputs, [x, y])
      if (res !== null) {
        // console.log([x,y], res)
        if (!counts[res]) {
          counts[res] = 0
        }
        counts[res]++
      } else {
        continue
      }

      if (x === 0) {
        if (check(inputs, [x - 1, y]) === res) {
          infinites.add(res)
        }
      } else if (y === 0) {
        if (check(inputs, [x, y - 1]) === res) {
          infinites.add(res)
        }
      } else if (x === maxX) {
        if (check(inputs, [x + 1, y]) === res) {
          infinites.add(res)
        }
      } else if (y === maxY) {
        if (check(inputs, [x, y + 1]) === res) {
          infinites.add(res)
        }
      }
    }
  }
  infinites.forEach(ind => {
    // console.log('infinite', ind)
    counts[ind] = 0
  })
  console.log(_.sortBy(counts))
}

async function solve2(input) {
  const lines = []
  for await (let line of readLines(input)) {
    lines.push(line)
  }

  const inputs = lines.map((line, ind) => {
    const [_, x, y] = line.match(/(\d+), (\d+)/)
    return { letter: ind, coord: [Number(x), Number(y)] }
  })

  const [maxX, maxY] = max(inputs)
  const infinites = new Set()
  let counts = []
  let area = 0

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      const totalManhattanDistance = inputs.reduce((prev, { coord }) => {
        return prev + manhattanDistance([x, y], coord)
      }, 0)
      if (totalManhattanDistance < 10000) {
        area++
      }
    }
  }

  return area
}

async function main() {
  // const input = 'dabAcCaCBAcCcaDA'
  const input = `${__dirname}/input.txt`

  // const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf8' })
  console.log('part1: ', await solve(input))
  console.log('part2: ', await solve2(input))
}

main()
