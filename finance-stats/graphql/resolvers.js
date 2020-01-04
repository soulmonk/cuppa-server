'use strict'

const scalar = require('./scalar')

const transactionRepository = require('../repository/transaction')

const Query = {
  transaction: async (obj, {id}, {app}) => {
    return transactionRepository.byIds(app.pg, id);
  },
  transactions: async (obj, args, {app}) => {
    return transactionRepository.all(app.pg, args);
  },
  total: async (obj, args, ctx) => {
    return []
  }
}

const resolvers = {
  ...scalar,
  Query,
  Mutation: {
    addTransaction: async (obj, { title }, { pubsub }) => {
      throw new Error('Not implemented')
    }
  }
}

module.exports = resolvers
