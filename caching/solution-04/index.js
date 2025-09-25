import { createCache } from 'async-cache-dedupe'
import fastify from 'fastify'
import Redis from 'ioredis'
import { createHash } from 'node:crypto'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
const cache = createCache({
  ttl: 5,
  storage: {
    type: 'redis',
    options: { client: new Redis({ port: process.env.USE_PROXY ? 16379 : 6379, enableAutoPipelining: true }) }
  }
})

cache.define('hash', async path => {
  const res = await fetch(`http://127.0.0.1:3001/${path}`)
  const hash = createHash('sha256')
    .update(await res.text())
    .digest('hex')

  return { hash }
})

app.get('/:path', async request => {
  return cache.hash(request.params.path)
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
