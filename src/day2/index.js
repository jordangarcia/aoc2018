const { readLines } = require('../utils/readLines')

const _ = require('lodash')

const OPERATOR_FNS = {
  '-': (a, b) => a - b,
  '+': (a, b) => a + b,
}

function biggerSmaller(str1, str2) {
  return str1.length > str2.length ? [str1, str2] : [str2, str1]
}

/**
 * @param {string} str1
 * @param {string} str2
 * @return {string}
 */
function subtractDifferences(str1, str2) {
  const [bigger, smaller] = biggerSmaller(str1, str2)
  let result = ''

  for (let i = 0; i < smaller.length; i++) {
    const c1 = smaller.charAt(i)
    const c2 = bigger.charAt(i)
    if (c1 === c2) {
      result += c1
    }
  }
  return result
}

function lineOccurrences(line) {
  const letters = {}

  for (let i = 0; i < line.length; i++) {
    const c = line.charAt(i)
    if (!letters[c]) {
      letters[c] = 0
    }
    letters[c]++
  }

  return letters
}

function matches(str1, str2, threshold = 1) {
  if (Math.abs(str1.length - str2.length) > threshold) {
    return false
  }

  const lengthDiff = Math.abs(str1.length - str2.length)
  if (lengthDiff) {
    const [bigger, smaller] = biggerSmaller(str1, str2)

    for (let i = 0; i < lengthDiff; i++) {
      if (bigger.substr(i, smaller.length) === smaller) {
        return true
      }
    }
    return false
  }

  let mismatches = 0
  for (let i = 0; i < str1.length; i++) {
    if (str1.charAt(i) !== str2.charAt(i)) {
      mismatches++
    }

    if (mismatches > threshold) {
      return false
    }
  }
  return true
}

function hasOccurrences(lineOccurrenceMap, times) {
  let numFound = 0
  let result = {}
  times.forEach(k => (result[k] = false))

  for (let count of Object.values(lineOccurrenceMap)) {
    if (result[count] === false) {
      result[count] = true
      numFound++
    }

    if (numFound === times.length) {
      break
    }
  }

  return result
}

async function solve(input) {
  var total = 0
  let num2s = 0
  let num3s = 0

  for await (let line of readLines(input)) {
    const { 2: has2, 3: has3 } = hasOccurrences(lineOccurrences(line), [2, 3])
    if (has2) {
      num2s++
    }
    if (has3) {
      num3s++
    }
  }

  return num2s * num3s
}

async function solve2(input) {
  let lines = []

  for await (let line of readLines(input)) {
    lines.push(line)
  }

  for (let index = 0; index < lines.length; index++) {
    const line1 = lines[index]

    for (let i = index + 1; i < lines.length; i++) {
      const line2 = lines[i]

      if (matches(line1, line2, 1)) {
        return subtractDifferences(line1, line2)
      }
    }
  }
}

async function main() {
  const input = `${__dirname}/input.txt`
  const answer1 = await solve(input)
  console.log('part1: ', answer1)

  const answer2 = await solve2(input)
  console.log('part2: ', answer2)
}

main()
