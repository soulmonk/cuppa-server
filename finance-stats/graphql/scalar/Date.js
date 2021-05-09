'use strict'

const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

module.exports = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue (value) {
    return new Date(parseInt(value, 10)) // value from the createClient
  },
  serialize (value) {
    return value.getTime() // value sent to the createClient
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)) // ast value is always in string format
    }
    return null
  }
})
