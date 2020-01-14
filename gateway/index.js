'use strict'

const fastify = require('fastify')({ logger: true })
const proxy = require('fastify-http-proxy')

fastify.register(require('fastify-cors'), {
  origin: [
    'http://localhost:4541', // ng serve - dev
    'http://localhost:3500' // dev separated
  ]
})

// note if api returns 404, proxy goes to the other route

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

// 'http://localhost:3000/api/notes' from origin 'http://localhost:3500'
// TODO using old server, before migrate
fastify.register(proxy, {
  upstream: 'http://localhost:4540',
  prefix: '/api',
  rewritePrefix: '/api'
})

// TODO web app
// fastify.register(proxy, {
//   upstream: 'http://localhost:3500',
//   prefix: '/'
// })

fastify.listen(3000)
