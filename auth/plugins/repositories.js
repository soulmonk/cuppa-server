'use strict'

const fp = require('fastify-plugin')

const UserRepository = require('./../repository/user')

async function repositories (fastify, opts) {
  fastify.decorate('repositories', {
    user: new UserRepository(fastify.pg, fastify.jwt, opts.jwt, opts.user)
  })
}

module.exports = fp(repositories, {
  dependencies: ['fastifyPostgres', 'fastifyJWT']
})
