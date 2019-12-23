'use strict'

const fp = require('fastify-plugin')

/*
// TODO
const redis = require('mqemitter-redis')
// TODO emitter in memory
const emitter = redis({
  port: 6579,
  host: '127.0.0.1'
})
 */

// Import external dependancies
const gql = require('fastify-gql')

// Import GraphQL Schema
const { schema, resolvers } = require('./schema')

async function fastifyGql (fastify/*, opts */) {
  // Register Fastify GraphQL
  fastify.register(gql, {
    schema,
    resolvers,
    graphiql: true
  })
}

module.exports = fp(fastifyGql)
