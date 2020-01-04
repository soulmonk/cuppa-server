'use strict'

const scalar = require('./scalar')

const transactionRepository = require('../repository/transaction')

const resolvers = {
  ...scalar,
  Query: {
    status: async () => 'OK',
    transaction: async (obj, {id}, ctx) => {
      return transactionRepository.byIds(ctx.pg, id);
    },
    transactions: async (obj, args, ctx) => {
      return transactionRepository.all(ctx.pg);
    },
    total: async (obj, args, ctx) => {
      return []
    }
  },
  Mutation: {
    addTransaction: async (obj, { title }, { pubsub }) => {
      throw new Error('Not implemented')
    }
  }
}

module.exports = resolvers
