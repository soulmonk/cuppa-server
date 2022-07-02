'use strict'

const fp = require('fastify-plugin')

// Import external dependancies
const mercurius = require('mercurius')

// Import GraphQL Schema
const { typeDefs, resolvers, loaders } = require('../graphql')
const { makeExecutableSchema } = require('@graphql-tools/schema')

async function fastifyGql (fastify/*, opts */) {
  // Register Fastify GraphQL
  // TODO security, if authorized
  fastify.register(mercurius, {
    schema: makeExecutableSchema({
      typeDefs,
      resolvers
    }),
    graphiql: false,
    routes: true,
    errorHandler,
    loaders,
    context,
    subscription: {
      emitter: fastify.redis,
      verifyClient
    }
  })

  async function context (request, reply) {
    return {
      user: request.user
    }
  }

  async function errorHandler (err, request, replay) {
    // todo make user friendly
    replay.log.error(err)
    replay.log.error(JSON.stringify(err))
    return {
      errors: err.errors
    }
  }

  function verifyClient (info, next) {
    // console.log(info)
    // todo fastify connection validation
    //
    // if (info.req.headers['x-fastify-header'] !== 'fastify is awesome !') {
    //   return next(false) // the connection is not allowed
    // }
    next(true) // the connection is allowed
  }
}

module.exports = fp(fastifyGql, {
  fastify: '>=3.x',
  dependencies: ['fastifyPostgres', 'fastifyRedis', 'fastifyJWT']
})
