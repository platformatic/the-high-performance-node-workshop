import { createCache } from 'async-cache-dedupe'
import fastify from 'fastify'
import Redis from 'ioredis'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
const cache = createCache({
  ttl: 60,
  storage: { type: 'redis', options: { client: new Redis({ enableAutoPipelining: true }) } }
})

cache.define('hash', async path => {
  // TODO: Fetch and compute the hash of the page
})

app.get('/:path', async request => {
  // TODO: Access the async-cache-dedupe cache
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
