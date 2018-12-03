var fs = require('fs')

async function* readLines(input) {
  var readStream = fs.createReadStream(input, { encoding: 'utf-8' })
  var remaining = ''

  for await (const chunk of readStream) {
    remaining += chunk
    var index = remaining.indexOf('\n')
    while (index > -1) {
      var line = remaining.substring(0, index)
      remaining = remaining.substring(index + 1)
      yield line
      index = remaining.indexOf('\n')
    }
  }
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

async function main() {
  const answer = await solve(`${__dirname}/input.txt`)
  process.stdout.write(answer)
}

main()
