import fastify from 'fastify'

const app = fastify({ logger: process.env.VERBOSE === 'true' })

app.get('/:tld', async request => {
  // TODO: Get the https://example.$TLD/ and compute its SHA256 hash

  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
