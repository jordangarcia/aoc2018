const { readLines } = require('../utils/readLines')

/**
 *
input: #123 @ 3,2: 5x4
  0123456789
0 ..........
1 ..........
2 ...#####..
3 ...#####..
4 ...#####..
5 ...#####..
6 ..........
7 ..........
8 ..........
 * Iterate through coordinates [x, y] based on input data
 * @param {*} param0
 */
function iterCoords({ id, lOff, tOff, width, height }, fn) {
  let x = lOff

  for (let w = 0; w < width; w++) {
    let y = tOff
    for (let l = 0; l < height; l++) {
      const res = fn({ x, y })
      if (!res === false) {
        break
      }
      y++
    }
    x++
  }
}

function overlaps(map1, map2) {
  for (const key of map2.keys()) {
    if (map1.has(key)) {
      return true
    }
  }
  return false
}

function stringCoords({ x, y }) {
  return `(${x},${y})`
}

function createMap(parsedData) {
  let m = new Map()
  iterCoords(parsedData, coords => {
    m.set(stringCoords(coords), 1)
  })
  return m
}

function parse(input) {
  var RE = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/
  const matches = input.match(RE)
  const answer = {
    id: matches[1],
    lOff: Number(matches[2]),
    tOff: Number(matches[3]),
    width: Number(matches[4]),
    height: Number(matches[5]),
  }
  return answer
}

function addMaps(map1, map2) {
  for (let [key, value] of map2.entries()) {
    if (!map1.has(key)) {
      map1.set(key, 1)
    } else {
      map1.set(key, map1.get(key) + 1)
    }
  }

  return map1
}

async function solve(input) {
  let count = 0
  let lines = []
  for await (let line of readLines(input)) {
    lines.push(line)
  }

  const totalMap = lines.reduce(
    (acc, line) => addMaps(acc, createMap(parse(line))),
    new Map(),
  )

  for (const [key, value] of totalMap.entries()) {
    // console.log('checking', key, value)
    if (value > 1) {
      count++
    }
  }
  return count
}

async function solve2(input) {
  let solution
  const claims = []
  for await (let line of readLines(input)) {
    const parsed = parse(line)
    claims.push({
      id: parsed.id,
      map: createMap(parsed),
    })
  }

  for (let i = 0; i < claims.length; i++) {
    let hasOverlap = false
    const claim = claims[i]
    for (let j = 0; j < claims.length; j++) {
      if (i === j) {
        continue
      }
      const otherClaim = claims[j]
      if (overlaps(claim.map, otherClaim.map)) {
        hasOverlap = true
        break
      }
    }

    if (!hasOverlap) {
      solution = claim.id
      break
    }
  }

  if (solution) {
    return solution
  }
}

async function main() {
  const input = `${__dirname}/input.txt`
  // const input = `${__dirname}/test.txt`
  const answer1 = await solve(input)
  console.log('part1: ', answer1)

  const answer2 = await solve2(input)
  console.log('part2: ', answer2)
}

main()
