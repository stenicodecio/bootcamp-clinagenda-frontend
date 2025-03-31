import { createServer, Model } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    models: {
      doctor: Model
    },
    routes() {
      this.namespace = 'api'
    }
  })
}
