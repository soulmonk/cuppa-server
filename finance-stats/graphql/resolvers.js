'use strict'

const scalar = require('./scalar')

const transactionRepository = require('../repository/transaction')
const transactionTypeRepository = require('../repository/transaction-type')
const cardRepository = require('../repository/card')
const bankRepository = require('../repository/bank')

const Query = {
  transaction: async (obj, { id }, { app }) => {
    return transactionRepository.byIds(app.pg, id)
  },
  transactions: async (obj, args, { app }) => {
    return transactionRepository.all(app.pg, args)
  },
  transactionTypes: async (obj, args, { app }) => {
    // todo per user (app.req.user.id)
    return transactionTypeRepository.all(app.pg)
  },
  cards: async (obj, args, { app }) => {
    // todo per user (app.req.user.id)
    return cardRepository.all(app.pg)
  },
  banks: async (obj, args, { app }) => {
    // todo per user (app.req.user.id)
    return bankRepository.all(app.pg)
  },
  total: async (obj, args, ctx) => {
    return []
  }
}

const Mutation = {
  addTransaction: async (obj, {transaction}, { app, pubsub }) => {
    console.log('resolvers.js::addTransaction::36 >>>', transaction)

    const result = transaction;
    result.id = 9999;
    result.type_id = result.type;
    delete result.type
    delete result.info
    result.card_id = result.card;
    delete result.card

    await pubsub.publish(
        {
          topic: `transactionAdded`,
          payload: {
            transaction
          }
        }
      )
    return result
  }
}

const Subscription = {
  transactionAdded: {
    subscribe: async (obj, args, { pubsub }) => {
      return pubsub.subscribe(`transactionAdded`)
    },
    resolve: payload => payload.transaction
  }
}

const resolvers = {
  ...scalar,
  Query,
  Mutation,
  Subscription
}

module.exports = resolvers
