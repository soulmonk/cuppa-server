'use strict'

import fp from 'fastify-plugin'
import UserRepository from './../repository/user.js'

async function repositories (fastify) {
  fastify.decorate('repositories', {
    user: new UserRepository(fastify.pg, fastify.jwt, {
      expiresIn: fastify.config.JWT_EXPIRES_IN,
    }, {
      rounds: fastify.config.USER_ROUNDS,
    }),
  })
}

export default fp(repositories, {
  dependencies: ['fastifyPostgres', 'fastifyJWT'],
})
