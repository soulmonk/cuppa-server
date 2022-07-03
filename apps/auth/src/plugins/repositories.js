'use strict'

const fp = require('fastify-plugin')

const UserRepository = require('./../repository/user')

async function repositories (fastify) {
  fastify.decorate('repositories', {
    user: new UserRepository(fastify.pg, fastify.jwt, {
      expiresIn: fastify.config.JWT_EXPIRES_IN
    }, {
      rounds: fastify.config.USER_ROUNDS
    })
  })
}

module.exports = fp(repositories, {
  dependencies: ['fastifyPostgres', 'fastifyJWT']
})
