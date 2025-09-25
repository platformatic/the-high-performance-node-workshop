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
    if (err) {
      return callback(err)
    }

    openFiles++

    const buf = Buffer.alloc(10000)
    read(fd, buf, 0, buf.length, 0, async (err, len, buffer) => {
      let readErr = null

      if (err) {
        return callback(err)
      }

      try {
        if (Math.random() < 0.5) {
          throw new Error('Kaboom!')
        }
      } catch (err) {
        readErr = err
        callback(err)
      } finally {
        close(fd, async err => {
          if (!err) {
            openFiles--
          }

          if (readErr) {
            // An error has been sent, ignore
            return
          }

          callback(err, buffer.toString('utf8', 0, len))
        })
      }
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
