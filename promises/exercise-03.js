import { close, open, read } from 'node:fs'
import { createServer } from 'node:http'

let openFiles = 0
let unhandleRejections = 0

process.on('unhandledRejection', err => {
  unhandleRejections++
})

setInterval(() => {
  console.log({ unhandleRejections, openFiles })
}, 1000)

function handler(callback) {
  open(import.meta.filename, 'r', async (err, fd) => {
    // TODO: Handle open result

    read(fd, buf, 0, buf.length, 0, async (err, len, buffer) => {
      if (err) {
        return callback(err)
      }

      // TODO: Throw an error randomly 50% of the times

      close(fd, async err => {
        if (err) {
          return callback(err)
        }

        openFiles--

        // TODO: Return the file content to the callback
      })
    })
  })
}

const server = createServer()

server.on('request', (_, response) => {
  handler((err, body) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' })
      response.end(err.message)
      return
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(body)
  })
})

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})
