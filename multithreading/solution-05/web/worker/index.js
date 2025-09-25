import fastify from 'fastify'
import { createHash, randomBytes } from 'node:crypto'

export function create() {
  const app = fastify({
    loggerInstance: globalThis.platformatic?.logger?.child({}, { level: globalThis.platformatic?.logLevel ?? 'info' })
  })

  app.get('/hash', async () => {
    const bytes = randomBytes(1e9)
    const hash = createHash('sha256').update(bytes).digest('hex')

    return { hash }
  })

  return app
}
