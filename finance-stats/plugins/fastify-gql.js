'use strict'

const fp = require('fastify-plugin')

// Import external dependancies
const gql = require('fastify-gql')

// Import GraphQL Schema
const { typeDefs, resolvers, loaders } = require('../graphql')
const { makeExecutableSchema } = require('graphql-tools')

async function fastifyGql (fastify/*, opts */) {
  // Register Fastify GraphQL
  fastify.register(gql, {
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: true, // todo debug
    routes: true,
    loaders,
    context: function (request, reply) {
      // Return an object that will be available in your GraphQL resolvers
      // todo DI, how to work with dependency
      return {
        pg: fastify.pg
      }
    },
    subscription: {
      emitter: fastify.redis,
      verifyClient: (info, next) => {
        // console.log(info)
        console.log('fastify-gql.js::verifyClient::30 >>>', info.req.headers)
        // todo fastify connection validation
        //
        // if (info.req.headers['x-fastify-header'] !== 'fastify is awesome !') {
        //   return next(false) // the connection is not allowed
        // }
        next(true) // the connection is allowed
      }
    }
  })
}

module.exports = fp(fastifyGql, {
  dependencies: ['fastifyPostgres', 'fastifyRedis']
})
