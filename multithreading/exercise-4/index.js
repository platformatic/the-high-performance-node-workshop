import fastify from 'fastify'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
// TODO: Create a new Piscina instance pointing to ./worker.mjs

app.get('/fast', async () => {
  return { time: Date.now() }
})

app.get('/slow', async () => {
  // TODO: Return the result of the piscina instance task run
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
