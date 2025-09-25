import fastify from 'fastify'

export function create() {
  const app = fastify({
    loggerInstance: globalThis.platformatic?.logger?.child({}, { level: globalThis.platformatic?.logLevel ?? 'info' })
  })

  app.get('/fast', async () => {
    return { time: Date.now() }
  })

  app.get('/slow', async () => {
    const response = await fetch('http://worker.plt.local/hash')
    return response.json()
  })

  return app
}
