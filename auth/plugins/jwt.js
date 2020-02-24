'use strict'

const fp = require('fastify-plugin')
const jwt = require('fastify-jwt')

const UserRepository = require('./../repository/user')

async function fastifyJWT (fastify, opts) {

  // TODO may be move to single plugin for initialization of all repository
  UserRepository.init(opts.user)

  fastify.register(jwt, {
    secret: opts.jwt.secret
  })

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()

      // todo expire
    } catch (err) {
      reply.log.error(err);
      reply.send(err)
    }
  })
}

module.exports = fp(fastifyJWT, {
  dependencies: ['fastifyPostgres']
})
