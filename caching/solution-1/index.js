import fastify from 'fastify'
import { createHash } from 'node:crypto'

const app = fastify({ logger: process.env.VERBOSE === 'true' })

app.get('/:tld', async request => {
  const res = await fetch(`https://example.${request.params.tld}/`)
  const hash = createHash('sha256')
    .update(await res.text())
    .digest('hex')
  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
