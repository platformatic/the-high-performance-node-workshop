import fastify from 'fastify'
import { createHash } from 'node:crypto'
import { Agent, interceptors } from 'undici'
import { RedisCacheStore } from 'undici-cache-redis'

const store = new RedisCacheStore({})
const agent = new Agent().compose(interceptors.cache({ store }))
const app = fastify({ logger: process.env.VERBOSE === 'true' })

app.get('/:path', async request => {
  const res = await agent.request({ origin: `http://127.0.0.1:3001/${request.params.path}`, method: 'GET', path: '/' })
  const hash = createHash('sha256')
    .update(await res.body.text())
    .digest('hex')
  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
