const _ = require('lodash')
const fs = require('fs')

class Node {
  constructor(id) {
    this.id = id
    this.numChildren
    this.numMetadata

    this.children = []
    this.metadata = []
  }

  getSize() {
    let size = 0

    if (this.children.length === 0) {
      return 2 + this.metadata.length
    }

    let childSize = 0
    this.children.forEach(child => {
      childSize += child.getSize()
    })

    return 2 + childSize + this.metadata.length
  }

  getValue() {
    if (!this.children.length) {
      return this.metadata.reduce((prev, curr) => prev + curr, 0)
    } else {
      return this.metadata.reduce((prev, index) => {
        const childByIndex = this.children[index - 1]
        if (!childByIndex) {
          return prev
        }
        return prev + childByIndex.getValue()
      }, 0)
    }
  }
}

function buildNode(arr, index = 0) {
  let [numChildren, numMetadata] = arr
  const node = new Node(index)

  const childArr = arr.slice(2)
  let offset = 0
  while (numChildren) {
    const childNode = buildNode(childArr.slice(offset), ++index)
    node.children.push(childNode)
    offset += childNode.getSize()
    numChildren--
  }
  node.metadata = _.take(arr.slice(node.getSize()), numMetadata)

  return node
}

function depthFirst(node, fn) {
  fn(node)
  if (node.children.length) {
    node.children.forEach(n => depthFirst(n, fn))
  }
}

function solve(arr) {
  const node = buildNode(arr)
  let total = 0
  depthFirst(node, node => {
    node.metadata.forEach(n => {
      total += n
    })
  })
  return total
  // console.log()
}

function solve2(arr) {
  const node = buildNode(arr)
  return node.getValue()
}

async function main() {
  const input = `${__dirname}/input.txt`
  const arr = fs
    .readFileSync(input, { encoding: 'utf-8' })
    .split(' ')
    .map(n => Number(n))
  const arr2 = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'.split(' ').map(a => Number(a))
  console.log('part1: ', solve(arr))
  console.log('part2: ', solve2(arr))
}

main()
