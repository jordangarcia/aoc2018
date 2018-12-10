let workTimelengths = {}
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((k, ind) => {
  workTimelengths[k] = ind + 1
})

class Worker {
  constructor(id) {
    this.id = id
    this.timeRemaining = Infinity
    this.doing = null
  }

  assign(step, onComplete) {
    this.onComplete = onComplete
    this.doing = step
    this.timeRemaining = 60 + workTimelengths[step]
  }

  tick() {
    if (!this.doing) {
      return
    }

    if (--this.timeRemaining === 0) {
      this.onComplete(this.doing)
      this.doing = null
      this.timeRemaining = Infinity
      this.onComplete = null
    }
  }

  isAvailable() {
    return !this.doing
  }
}

class WorkerPool {
  constructor(numWorkers) {
    this.pool = [];
    this.time = 0;
    for (let i = 0; i < numWorkers; i++) {
      this.pool.push(new Worker(i + 1));
    }
  }
  tick() {
    this.time++;
    this.pool.forEach(worker => worker.tick());
  }
  hasAvailableWorker() {
    return this.pool.some(w => w.isAvailable());
  }
  areAllAvailable() {
    return this.pool.every(w => w.isAvailable());
  }
  getAvailableWorker() {
    let found;
    for (let worker of this.pool) {
      if (worker.isAvailable()) {
        found = worker;
        break;
      }
    }
    return found;
  }
}

exports.Worker = Worker
exports.WorkerPool = WorkerPool