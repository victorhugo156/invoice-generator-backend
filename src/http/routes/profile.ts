import { FastifyInstance } from 'fastify'

export async function profile(app: FastifyInstance) {
  app.get('/profile', () => {
    return 'Hello Profile'
  })
}
