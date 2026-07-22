import { FastifyInstance } from 'fastify'
import { OAuth2Client } from 'google-auth-library'
import { env } from '../../config/env'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AuthProvider } from '@prisma/client'

// A single OAuth2Client instance reused across all requests.
// Creating it once here avoids unnecessary overhead per request.
const client = new OAuth2Client()

export async function auth(app: FastifyInstance) {
  app.post('/auth/login', async (request, reply) => {

    // --- Step 1: Validate the request body ---
    // The frontend sends { credential: "<Google JWT>" }.
    // Zod ensures the body has the expected shape before we touch it.
    const tokenBodySchema = z.object({
      credential: z.string(),
    })
    const { credential } = tokenBodySchema.parse(request.body)

    // --- Step 2: Verify the Google credential ---
    // Google issues a short-lived JWT when the user clicks "Sign in with Google".
    // verifyIdToken contacts Google's public keys to confirm:
    //   - the token was actually signed by Google (not forged)
    //   - the token hasn't expired
    //   - the audience matches our app's client ID
    // If any check fails, it throws — we catch that and return 401.
    let ticket
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      })
    } catch (err) {
      console.error('verifyIdToken failed:', err)
      return reply.status(401).send({ message: 'Invalid credential' })
    }

    // --- Step 3: Extract user info from the verified token ---
    // getPayload() returns the decoded JWT body containing the user's info.
    // It can theoretically be undefined, so we guard against that.
    const payload = ticket.getPayload()
    if (!payload) {
      return reply.status(400).send({ message: 'Payload undefined' })
    }

    // sub  → Google's permanent unique ID for this user (never changes)
    // email → the user's Google email address
    // name  → the user's display name
    // Google doesn't guarantee email/name are present, so we guard here too.
    const { sub, email, name } = payload
    if (!email || !name) {
      return reply.status(400).send({ message: 'email or name undefined' })
    }

    // --- Step 4: Look up the user in our database ---
    // We use email as the lookup key. If found, they've logged in before.
    // If not found, this is their first login — we create a new account.
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      // --- Step 5a: Existing user — enforce auth method locking ---
      // If this email was registered via magic link, block the Google login.
      // Error messages are intentionally vague to avoid revealing account info.
      if (user.auth_provider === AuthProvider.MAGIC_LINK) {
        return reply
          .status(409)
          .send({ message: 'You have logged with magic link' })
      }

      // --- Step 6a: Issue a session token for the returning user ---
      // We sign our own app JWT containing the user's DB id as the subject (sub).
      // This is the token our backend will use to identify the user on future requests.
      const token = app.jwt.sign({}, { sign: { sub: user.id } })

      // The token is stored in an httpOnly cookie so JavaScript cannot read it,
      // protecting against XSS attacks. sameSite: 'lax' allows cross-origin requests
      // triggered by top-level navigation (e.g. link clicks).
      reply.cookie('token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        sameSite: 'lax',
      })

      return reply.status(200).send({ message: 'Login successful' })
    } else {
      // --- Step 5b: New user — create their account ---
      // We store google_id (the sub) so we can reliably identify this Google
      // account in the future, even if the user changes their email.
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          google_id: sub,
          auth_provider: AuthProvider.GOOGLE,
        },
      })

      // --- Step 6b: Issue a session token for the newly created user ---
      const token = app.jwt.sign({}, { sign: { sub: newUser.id } })
      reply.cookie('token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      })

      return reply.status(200).send({ message: 'Login successful' })
    }
  })
}
