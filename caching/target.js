import fastify from 'fastify'
import { setTimeout as sleep } from 'node:timers/promises'

const app = fastify()

app.get('/*', { config: { cache: 1000 } }, async (_, reply) => {
  await sleep(3000)

  reply.header('cache-control', 'public, max-age=60')
  return randomBytes(1024).toString('hex')
})

await app.listen({ port: 3001 })
console.log('Listening on http://localhost:3001')
