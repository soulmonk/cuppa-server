'use strict'

const fastify = require('fastify')({ logger: true })
const proxy = require('fastify-http-proxy')

fastify.register(proxy, {
  upstream: 'http://localhost:3030',
  prefix: '/auth'
})

fastify.register(proxy, {
  upstream: 'http://localhost:3031',
  prefix: '/finance-stats'
})

fastify.register(proxy, {
  upstream: 'http://localhost:3035',
  prefix: '/time-tracker'
})

fastify.listen(3000)
