const _ = require('lodash')
const { readLines } = require('../utils/readLines')

function parse(line) {
  const RE = /\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] ([\w\s#]+)/
  const matches = line.match(RE)
  const actionStr = matches[6]

  const GAURD_RE = /^Guard #(\d+) begins shift$/
  const FALLS_ASLEEP_RE = /falls asleep/
  const WAKES_UP_RE = /wakes up/

  let id
  let action
  // console.log(actionStr, GAURD_RE.test(actionStr))
  if (GAURD_RE.test(actionStr)) {
    action = 'begin'
    id = actionStr.match(GAURD_RE)[1]
  } else if (FALLS_ASLEEP_RE.test(actionStr)) {
    action = 'sleep'
  } else if (WAKES_UP_RE.test(actionStr)) {
    action = 'wake'
  }

  return {
    date: new Date(
      `${matches[1]}-${matches[2]}-${matches[3]} ${matches[4]}:${matches[5]}`,
    ).getTime(),
    year: Number(matches[1]),
    month: Number(matches[2]),
    day: Number(matches[3]),
    hour: Number(matches[4]),
    minute: Number(matches[5]),
    id,
    action,
    actionStr,
  }
}

function initOrInc(obj, key) {
  if (!obj[key]) {
    obj[key] = 0
  }

  obj[key]++
}

async function getGaurds(input) {
  let gaurds = {}
  let currentGaurd = null
  let fallAsleepTime = null
  let lines = []
  for await (let line of readLines(input)) {
    lines.push(parse(line))
  }

  lines = _.sortBy(lines, 'date')
  lines.forEach(line => {
    const { action, id, minute } = line
    if (action === 'begin') {
      if (gaurds[id]) {
        currentGaurd = gaurds[id]
      } else {
        currentGaurd = {
          id,
          minutesAsleep: {},
          total: 0,
        }
        gaurds[id] = currentGaurd
      }
    } else if (action === 'sleep') {
      fallAsleepTime = minute
    } else if (action === 'wake') {
      for (var i = fallAsleepTime; i < minute; i++) {
        initOrInc(currentGaurd.minutesAsleep, i)
        currentGaurd.total++
      }
    }
  })

  return gaurds
}

async function solve(input) {
  const gaurds = await getGaurds(input)
  const winner = _.orderBy(Object.values(gaurds), 'total', 'desc')[0]

  const [minuteWinner] = _.orderBy(
    Object.entries(winner.minutesAsleep),
    ([a, b]) => -b,
  )[0]

  return minuteWinner * Number(winner.id)
}

async function solve2(input) {
  const gaurds = await getGaurds(input)

  const winner = _.chain(Object.values(gaurds))
    .map(gaurd => {
      let topMinute = null
      let topMinuteCount = 0
      let orderedMinutes = _.orderBy(Object.entries(gaurd.minutesAsleep), ([a, b]) => -b)
      if (orderedMinutes.length) {
        topMinute = Number(orderedMinutes[0][0])
        topMinuteCount = Number(orderedMinutes[0][1])
      }

      gaurd.topMinute = topMinute
      gaurd.topMinuteCount = topMinuteCount
      return gaurd
    })
    .sortBy('topMinuteCount', 'asc')
    .last()
    .value()

  return winner.topMinute * Number(winner.id)
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
