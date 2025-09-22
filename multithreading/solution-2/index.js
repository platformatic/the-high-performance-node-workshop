import fastify from 'fastify'
import { createHash, randomBytes } from 'node:crypto'
import { isMainThread, parentPort, Worker } from 'node:worker_threads'

function startWorker() {
  parentPort.on('message', message => {
    if (message?.type !== 'request') {
      return
    }

    const bytes = randomBytes(1e9)
    parentPort.postMessage({ type: 'response', id: message.id, hash: createHash('sha256').update(bytes).digest('hex') })
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

    inflights[message.id](message.hash)
  })

  app.get('/fast', async () => {
    return { time: Date.now() }
  })

  app.get('/slow', async () => {
    const id = requestIndex++

    const promise = new Promise(_resolve => {
      inflights[id] = _resolve
    })

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
