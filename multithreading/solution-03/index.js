import fastify from 'fastify'
import { createHash, randomBytes } from 'node:crypto'
import { isMainThread, parentPort, Worker } from 'node:worker_threads'

const SHA256_BYTE_LENGTH = 32

async function startWorker() {
  parentPort.on('message', message => {
    if (message?.type !== 'request') {
      return
    }

    /*
      Create a buffer pointing to the shared array buffer.
      The second argument, the offset, is set to 4 to skip 
      the first 4 bytes which are are reserved to notify the main thread.
    */
    const buffer = Buffer.from(message.sharedArrayBuffer, 4)

    // Compute the hash
    const bytes = randomBytes(1e9)
    createHash('sha256').update(bytes).digest().copy(buffer)

    // Notify the parent thread
    const int32Array = new Int32Array(message.sharedArrayBuffer)
    int32Array[0] = 1
    Atomics.notify(int32Array, 0)
  })
}

function startServer() {
  const app = fastify({ logger: process.env.VERBOSE === 'true' })

  let nextWorker = 0
  const workers = []
  for (let i = 0; i < 5; i++) {
    workers.push(new Worker(import.meta.filename))
  }

  app.get('/fast', async () => {
    return { time: Date.now() }
  })

  app.get('/slow', async () => {
    /*
      Other than the bytes for the SHA256, we just needed an extra element to allow
      to notify the main thread when the operation is completed.
      Since Atomics worked with Int32, this means we need 4 bytes.
    */
    const sharedArrayBuffer = new SharedArrayBuffer(SHA256_BYTE_LENGTH + 4)
    const int32Array = new Int32Array(sharedArrayBuffer)

    const currentWorker = nextWorker++ % workers.length
    workers[currentWorker].postMessage({ type: 'request', sharedArrayBuffer })
    await Atomics.waitAsync(int32Array, 0, 0).value

    return {
      hash: Buffer.from(sharedArrayBuffer, 4).toString('hex')
    }
  })

  app.listen({ port: 3000 }, () => {
    console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
  })
}

if (isMainThread) {
  await startServer()
} else {
  await startWorker()
}
