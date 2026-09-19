import { app } from './app'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from './config/env'
import { profile } from './http/routes/profile'
import { auth } from './http/routes/auth'
import { errorHandler } from './http/error-handler'
import cookie from '@fastify/cookie'


app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})

app.register(cookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: env.EXPIRES_IN,
  },
  cookie: {
    cookieName: 'token',
    signed: false,
  },
})

app.register(auth)
app.register(profile)
app.setErrorHandler(errorHandler)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
