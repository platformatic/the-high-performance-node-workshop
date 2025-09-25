import fastify from 'fastify'
import { randomBytes } from 'node:crypto'

const app = fastify({ logger: process.env.VERBOSE === 'true' })

app.get('/fast', async () => {
  // TODO: Compute the time variable with the current Epoch Time in milliseconds

  return { time }
})

app.get('/slow', async () => {
  const bytes = randomBytes(1e9)

  // TODO: Compute the hash variable with the SHA256 of bytes.

  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
