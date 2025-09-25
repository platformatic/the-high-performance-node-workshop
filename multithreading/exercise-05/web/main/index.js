import fastify from 'fastify'

export function create() {
  const app = fastify({
    loggerInstance: globalThis.platformatic?.logger?.child({}, { level: globalThis.platformatic?.logLevel ?? 'info' })
  })

  app.get('/fast', async () => {
    return { time: Date.now() }
  })

  app.get('/slow', async () => {
    /*
      TODO: Compute the hash in the worker service.
      
      In order to invoke it use can use fetch pointing to the http://worker.plt.local domain.
    */
  })

  return app
}
