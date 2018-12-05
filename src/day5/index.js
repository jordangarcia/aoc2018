const fs = require('fs')

function destroys(input, pos) {
  const a = input.charAt(pos)
  const b = input.charAt(pos + 1)
  const res = a.toLowerCase() === b.toLowerCase() && a !== b

  return res
}

function remove(str, start, num) {
  const res = str.slice(0, start) + str.slice(start + num)
  return res
}

function solve(input) {
  let i = 0
  let str = input
  while (true) {
    if (i + 1 === str.length) {
      break
    }
    if (destroys(str, i)) {
      str = remove(str, i, 2)
      i--
    } else {
      i++
    }
  }
  return str.length
}

const iterAlphabet = function*() {
  const aCode = 97
  const bCode = 122
  for (let code = aCode; code <= bCode; code++) {
    yield String.fromCharCode(code)
  }
}

function solve2(input) {
  const res = []

  ;[...iterAlphabet()].forEach(letter => {
    const inputWithRemoved = input.replace(
      new RegExp(`[${letter}${letter.toUpperCase()}]`, 'g'),
      '',
    )
    res.push(solve(inputWithRemoved))
  })

  return res.sort((a,b) => a -b)[0]
}

function main() {
  // const input = 'dabAcCaCBAcCcaDA'
  const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf8' })
  console.log('part1: ', solve(input))
  console.log('part2: ', solve2(input))
}

main()
