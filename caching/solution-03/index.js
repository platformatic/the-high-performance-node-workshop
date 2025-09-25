import fastify from 'fastify'
import Redis from 'ioredis'
import { createHash } from 'node:crypto'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
const redis = new Redis({ enableAutoPipelining: true })

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

  await redis.set(path, hash, 'EX', 15) // Cache for 15 seconds

  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
