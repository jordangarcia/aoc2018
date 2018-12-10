const { WorkerPool, Worker } = require("./WorkerPool");


const fs = require('fs')
const _ = require('lodash')
const { readLines } = require('../utils/readLines')

const RE = /^Step ([A-Z]{1}) must be finished before step ([A-Z]{1}) can begin.$/

async function solve(input) {
  const deps = await getDeps(input)

  let procedure = []
  let found = []
  let shouldFind = true
  while (shouldFind || found.length > 0) {
    if (shouldFind) {
      for (let [step, prereqs] of Object.entries(deps)) {
        if (prereqs.size === 0 && found.indexOf(step) === -1) {
          found.push(step)
        }
      }
      found.sort()
      shouldFind = false
      continue
    }

    if (found.length) {
      const doing = found.shift()
      procedure.push(doing)

      for (let [step, prereqs] of Object.entries(deps)) {
        if (prereqs.has(doing)) {
          prereqs.delete(doing)
        }
      }
      delete deps[doing]
      shouldFind = true
    }
  }
  return procedure.join('')
}



async function getDeps(input) {
  const deps = {}
  for await (let line of readLines(input)) {
    const [_, prereq, step] = line.match(RE)
    if (!deps[step]) {
      deps[step] = new Set()
    }
    if (!deps[prereq]) {
      deps[prereq] = new Set()
    }

    deps[step].add(prereq)
  }
  return deps
}

async function solve2(input) {
  const deps = await getDeps(input)

  let workToDo = []
  let t = 0
  const pool = new WorkerPool(5)
  while (true) {
    for (let [step, prereqs] of Object.entries(deps)) {
      if (prereqs.size === 0 && workToDo.indexOf(step) === -1) {
        workToDo.push(step)
      }
    }
    workToDo.sort()

    if (pool.areAllAvailable() && workToDo.length === 0) {
      break
    }

    while (workToDo.length && pool.hasAvailableWorker()) {
      const worker = pool.getAvailableWorker()
      const step = workToDo.shift()
      delete deps[step]
      worker.assign(step, finishedStep => {
        for (let [step, prereqs] of Object.entries(deps)) {
          if (prereqs.has(finishedStep)) {
            prereqs.delete(finishedStep)
          }
        }
      })
    }

    pool.tick()
  }

  return pool.time
}

async function main() {
  const input = `${__dirname}/input.txt`
  console.log('part1: ', await solve(input))
  console.log('part2: ', await solve2(input))
}

main()
