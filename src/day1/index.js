const { readLines } = require('../utils/readLines')

const _ = require('lodash')

const OPERATOR_FNS = {
  '-': (a, b) => a - b,
  '+': (a, b) => a + b,
}

async function solve(input) {
  var total = 0

  for await (let line of readLines(input)) {
    const operator = line.charAt(0)
    total = OPERATOR_FNS[operator](total, parseInt(line.slice(1), 10))
  }

  return total
}

async function solve2(input) {
  let total = 0
  let solution
  let freqs = {
    [total]: true,
  }

  while (!solution) {
    for await (let line of readLines(input)) {
      const operator = line.charAt(0)
      total = OPERATOR_FNS[operator](total, parseInt(line.slice(1), 10))
      // console.log(total)
      if (freqs[total]) {
        solution = total
        break
      }

      freqs[total] = true
    }
  }

  return solution
}

async function main() {
  const input = `${__dirname}/input.txt`
  const answer1 = await solve(input)
  const answer2 = await solve2(input)

  console.log('part1: ', answer1)
  console.log('part2: ', answer2)
}

main()
