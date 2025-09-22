import fastify from 'fastify'
import Redis from 'ioredis'
import { createHash } from 'node:crypto'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
const redis = new Redis()

app.get('/:tld', async request => {
  // TODO: Access the cache and return the value if present

  const res = await fetch(`https://example.${request.params.tld}/`)
  const hash = createHash('sha256')
    .update(await res.text())
    .digest('hex')

  // TODO: Save the value in cache

  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
