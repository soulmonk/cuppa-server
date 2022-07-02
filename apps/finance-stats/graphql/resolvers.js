'use strict'

const { resolvers: { DateTime } } = require('graphql-scalars')
const Query = require('./queries')

const Mutation = require('./mutations')

const Subscription = {
  transactionAdded: {
    subscribe: async (obj, args, { pubsub }) => {
      return pubsub.subscribe('transactionAdded')
    },
    resolve: payload => payload.transaction
  }
}

const resolvers = {
  DateTime,
  Query,
  Mutation,
  Subscription
}

module.exports = resolvers
