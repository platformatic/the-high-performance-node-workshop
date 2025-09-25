import fastify from 'fastify'

const app = fastify({ logger: process.env.VERBOSE === 'true' })

app.get('/:path', async request => {
  // TODO: Get the http://127.0.0.1:3001/$path and compute its SHA256 hash

  return { hash }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
