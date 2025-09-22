import fastify from 'fastify'
import { createHash, randomBytes } from 'node:crypto'
import { isMainThread, parentPort } from 'node:worker_threads'

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

    /*
      TODO: Notify the parent thread.

      1. Create a new array backed by the message.sharedArrayBuffer which is usable by the Atomics API.
      2. Set its first element to be non zero.
      3. Notify the main thread that the array value has changed.
    */
  })
}

function startServer() {
  const app = fastify({ logger: process.env.VERBOSE === 'true' })

  let nextWorker = 0
  const workers = []
  // TODO: Create a pool of 5 workers threads

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

    // TODO: Select a worker using the Round Robin policy

    workers[currentWorker].postMessage({ type: 'request', sharedArrayBuffer })

    /*
      TODO: Wait for the worker thread to signal completion.

      1. Create a new array backed by the message.sharedArrayBuffer which is usable by the Atomics API.
      2. Wait for the first element to be non zero.
    */

    // TODO: Create a buffer backed by sharedArrayBuffer to extract the result. Remember to use the right offset.

    return {
      hash: buffer.toString('hex')
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
