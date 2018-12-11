const _ = require('lodash')
const fs = require('fs')

class CircularlyLinkedListNode {
  constructor(value, left, right) {
    this.value = value
    if (left && right) {
      this.left = left
      this.right = right
    } else {
      this.left = this
      this.right = this
    }
  }

  remove() {
    if ((this.left === this.right) === this) {
      throw new Error('cannot remove last node')
    }
    this.left.right = this.right
    this.right.left = this.left

    return this
  }

  addRight(value) {
    const newNode = new CircularlyLinkedListNode(value, this, this.right)
    this.right.left = newNode
    this.right = newNode
    return newNode
  }

  rprint() {
    let str = String(this.value)
    let left = this.left
    while (left !== this) {
      str += ' ' + left.value
      left = left.left
    }

    return str
  }

  print() {
    let str = String(this.value)
    let right = this.right
    while (right !== this) {
      str += ' ' + right.value
      right = right.right
    }

    return str
  }

  moveLeft(x) {
    let l = this.left
    while (--x) {
      l = l.left
    }
    return l
  }

  moveRight(x) {
    let r = this.right
    while (--x) {
      r = r.right
    }
    return r
  }
}

const a = new CircularlyLinkedListNode('a')
const b = a.addRight('b')
const c = b.addRight('c')

class Game {
  constructor(numPlayers, lastMarble) {
    this.debug = false
    this.numPlayers = numPlayers
    this.currentPlayer = 0
    this.lastMarble = lastMarble
    this.scores = []

    for (let i = 0; i < numPlayers; i++) {
      this.scores.push(0)
    }

    this.turn = 0
    this.board = new CircularlyLinkedListNode(0)
    this.current = this.board
    this.done = false
  }

  playRound() {
    if (this.debug) {
      console.log(
        `[${this.currentPlayer + 1}] (${this.current.value}) ${this.board.print()}`,
      )
    }
    // console.log(`[${this.currentPlayer + 1}] (${this.current.value}) ${this.board.rprint()}`)

    this.turn++

    if (this.turn % 23 === 0) {
      this.specialTurn()
    } else {
      this.normalTurn()
    }

    this.currentPlayer = (this.currentPlayer + 1) % this.numPlayers
  }

  specialTurn() {
    let scoreThisTurn = this.turn

    const toRemove = this.current.moveLeft(7)
    this.current = toRemove.right
    const { value } = toRemove.remove()

    scoreThisTurn += value

    this.scores[this.currentPlayer] += scoreThisTurn
    if (this.debug) {
      console.log('scores', this.scores)
    }
  }

  normalTurn() {
    this.current = this.current.moveRight(1).addRight(this.turn)
  }

  play(numRounds) {
    while (this.turn <= this.lastMarble) {
      this.playRound()
    }

    return _.chain(this.scores)
      .sortBy()
      .reverse()
      .take(5)
      .value()
  }
}

// const game = new Game(9, 50)

// const game = new Game(10, 1618)
// const game = new Game(13, 7999)
// const game = new Game(17, 1104)
// const game = new Game(21, 6111)
// console.log(game.play())

function solve() {
  const game = new Game(435, 71184)
  return game.play()
}

function solve2() {
  const game = new Game(435, 7118400)
  return game.play()
}

async function main() {
  console.log('part1: ', solve())
  console.log('part2: ', solve2())
}

main()
