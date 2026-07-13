import { FastifyInstance } from 'fastify'
import { OAuth2Client } from 'google-auth-library'
import { env } from '../../config/env'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AuthProvider } from '@prisma/client'

const client = new OAuth2Client()

export async function auth(app: FastifyInstance) {
  app.post('/auth/login', async (request, replay) => {
    const tokenBodySchema = z.object({
      credential: z.string(),
    })

    const { credential } = tokenBodySchema.parse(request.body)

    let ticket

    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      })
    } catch (err) {
      console.error('verifyIdToken failed:', err)
      return replay.status(401).send({ message: 'Invalid credential' })
    }

    const payload = ticket.getPayload()

    if (!payload) {
      return replay.status(400).send({ message: 'Payload undefined' })
    }

    const { sub, email, name } = payload

    if (!email || !name) {
      return replay.status(400).send({ message: 'email or name undefined' })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      if (user.auth_provider === AuthProvider.MAGIC_LINK) {
        return replay
          .status(409)
          .send({ message: 'You have logged with magic link' })
      } else {
        const token = await replay.jwtSign(
          {},
          {
            sign: {
              sub: user.id,
            },
          },
        )
        return replay.status(200).send(token)
      }
    } else {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          google_id: sub,
          auth_provider: AuthProvider.GOOGLE,
        },
      })
      const token = await replay.jwtSign(
        {},
        {
          sign: {
            sub: newUser.id,
          },
        },
      )
      return replay.status(200).send(token)
    }
  })
}
