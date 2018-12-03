var fs = require('fs')

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

exports.readLines = readLines
