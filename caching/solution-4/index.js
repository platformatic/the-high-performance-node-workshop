import { createCache } from 'async-cache-dedupe'
import fastify from 'fastify'
import Redis from 'ioredis'
import { createHash } from 'node:crypto'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
const cache = createCache({
  ttl: 60,
  storage: { type: 'redis', options: { client: new Redis({ enableAutoPipelining: true }) } }
})

cache.define('hash', async tld => {
  const res = await fetch(`https://example.${tld}/`)
  const hash = createHash('sha256')
    .update(await res.text())
    .digest('hex')

  return { hash }
})

app.get('/:tld', async request => {
  return cache.hash(request.params.tld)
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
