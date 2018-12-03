var fs = require('fs')
const _ = require('lodash')

// super overkill async iterator of readline
async function* readLines(input) {
  var readStream = fs.createReadStream(input, { encoding: 'utf8', highWaterMark: 1024 })
  var remaining = ''

  for await (const chunk of readStream) {
    // console.log('>>>' + chunk)
    remaining += chunk
    var index = remaining.indexOf('\n')
    while (index > -1) {
      var line = remaining.substring(0, index)
      remaining = remaining.substring(index + 1)
      // console.log('line', line)
      yield line
      index = remaining.indexOf('\n')
    }
  }
  yield remaining
}

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
  let solution;
  let freqs = {
    [total]: true
  }

  while(!solution) {
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
