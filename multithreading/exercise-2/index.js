import fastify from 'fastify'
import { createHash, randomBytes } from 'node:crypto'
import { isMainThread, parentPort, Worker } from 'node:worker_threads'

function startWorker() {
  parentPort.on('message', message => {
    if (message?.type !== 'request') {
      return
    }

    const bytes = randomBytes(1e9)
    const hash = createHash('sha256').update(bytes).digest('hex')

    // TODO: Post a message back to the parent thread. Make sure to use the right type, id and hash.
  })
}

function startServer() {
  const app = fastify({ logger: process.env.VERBOSE === 'true' })
  const worker = new Worker(import.meta.filename)

  let requestIndex = 0
  const inflights = {}

  worker.on('message', message => {
    if (message?.type !== 'response') {
      return
    }

    // TODO: Resolve the correct promise with the returned hash value
  })

  app.get('/fast', async () => {
    return { time: Date.now() }
  })

  app.get('/slow', async () => {
    const id = requestIndex++

    // TODO: Create a promise and save its resolve method for later in the inflights object.

    worker.postMessage({ type: 'request', id })

    return { hash: await promise }
  })

  app.listen({ port: 3000 }, () => {
    console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
  })
}

if (isMainThread) {
  startServer()
} else {
  startWorker()
}
