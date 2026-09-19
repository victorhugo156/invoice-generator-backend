import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../middlewares/auth'

export async function profile(app: FastifyInstance) {
  app.get('/profile', { onRequest: [verifyJWT] }, async (request) => {
    
    return { userId: request.user.sub }
  })
}
