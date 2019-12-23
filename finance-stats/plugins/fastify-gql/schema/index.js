'use strict'

const redis = require('mqemitter-redis')
const emitter = redis({
  port: 6579,
  host: '127.0.0.1'
})

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y
  }
}
module.exports = {
  schema,
  resolvers
}
