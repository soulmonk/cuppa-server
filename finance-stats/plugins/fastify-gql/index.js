'use strict'

const fp = require('fastify-plugin')

// TODO
const redis = require('mqemitter-redis')
// TODO move to fastify plugin
const emitter = redis({
  port: 6379,
  host: '127.0.0.1'
})

// Import external dependancies
const gql = require('fastify-gql')

// Import GraphQL Schema
const { typeDefs, resolvers } = require('./../../graphql')
const { makeExecutableSchema } = require('graphql-tools')

async function fastifyGql (fastify/*, opts */) {
  // Register Fastify GraphQL
  fastify.register(gql, {
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: true,
    routes: true,
    subscription: {
      emitter,
      verifyClient: (info, next) => {
        // todo fastyfy connection validation
        if (info.req.headers['x-fastify-header'] !== 'fastify is awesome !') {
          return next(false) // the connection is not allowed
        }
        next(true) // the connection is allowed
      }
    }
  })
}

module.exports = fp(fastifyGql)
//   dependencies: ['fastifyRedis']
