import fastify from 'fastify'
import { Piscina } from 'piscina'

const app = fastify({ logger: process.env.VERBOSE === 'true' })
const piscina = new Piscina({
  filename: new URL('./worker.js', import.meta.url).toString(),
  maxQueue: 20
})

app.get('/fast', async () => {
  return { time: Date.now() }
})

app.get('/slow', async () => {
  return { hash: await piscina.run({}) }
})

app.listen({ port: 3000 }, () => {
  console.log(`The server is listening at http://127.0.0.1:${app.server.address().port} ...`)
})
