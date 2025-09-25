import fastify from 'fastify'
import Redis from 'ioredis'
import { createHash } from 'node:crypto'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
const redis = new Redis({ port: process.env.USE_PROXY ? 16379 : 6379, enableAutoPipelining: false })

app.get('/:path', async request => {
  const path = request.params.path
  const cached = await redis.get(path)

  if (cached) {
    return { hash: cached }
  }

  const res = await fetch(`http://127.0.0.1:3001/${path}`)
  const hash = createHash('sha256')
    .update(await res.text())
    .digest('hex')

  await redis.set(path, hash, 'EX', 5) // Cache for 5 seconds

  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
