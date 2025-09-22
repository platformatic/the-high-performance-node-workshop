import fastify from 'fastify'
import Redis from 'ioredis'
import { createHash } from 'node:crypto'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
const redis = new Redis()

app.get('/:tld', async request => {
  const tld = request.params.tld
  const cached = await redis.get(tld)

  if (cached) {
    return { hash: cached }
  }

  const res = await fetch(`https://example.${tld}/`)
  const hash = createHash('sha256')
    .update(await res.text())
    .digest('hex')

  await redis.set(tld, hash, 'EX', 60) // Cache for 1 minute

  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
