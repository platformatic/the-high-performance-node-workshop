
import { type FastifyInstance } from 'fastify'
import { PlatformaticApplication, PlatformaticGatewayConfig } from '@platformatic/gateway'

declare module 'fastify' {
  interface FastifyInstance {
    platformatic: PlatformaticApplication<PlatformaticGatewayConfig>
  }
}
