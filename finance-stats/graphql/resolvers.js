'use strict'

const scalar = require('./scalar')

const transactionRepository = require('../repository/transaction')
const transactionTypeRepository = require('../repository/transaction-type')
const transactionInfoRepository = require('../repository/transaction-info')
const cardRepository = require('../repository/card')
const bankRepository = require('../repository/bank')

//
const config = {
  currencyCode: 'UAH'
}

// todo per user (app.req.user.id)
const Query = {
  transaction: async (obj, { id }, { app }) => {
    return transactionRepository.byId(app.pg, id)
      .then(transactionRepository.toJson.bind(transactionRepository))
  },
  transactions: async (obj, args, { app }) => {
    return transactionRepository.all(app.pg, args)
      .then(res => res.map(transactionRepository.toJson.bind(transactionRepository)))
  },
  transactionTypes: async (obj, args, { app }) => {
    return transactionTypeRepository.all(app.pg)
  },
  cards: async (obj, args, { app }) => {
    return cardRepository.all(app.pg)
      .then(res => res.map(cardRepository.toJson.bind(cardRepository)))
  },
  banks: async (obj, args, { app }) => {
    return bankRepository.all(app.pg)
  },
  total: async (obj, args, ctx) => {
    return []
  }
}

const Mutation = {
  addTransaction: async (obj, { transaction }, { app, pubsub }) => {
    console.log('resolvers.js::addTransaction::42 >>>', transaction)
    // todo TZ
    // todo fetch Exchange rate for date

    // db transaction

    const data = {
      date: typeof transaction.date === 'undefined' ? 'now()' : transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type_id: transaction.type, // todo rename?
      note: typeof transaction.note !== 'string' ? '' : transaction.note,
      currency_code: transaction.currencyCode === undefined ? config.currencyCode : transaction.currencyCode,
      card_id: transaction.card === undefined ? null : transaction.card,
      user_id: 1 // TODO USER ID
    }

    let result = await transactionRepository.create(app.pg, data)
    // no need
    // const result = await transactionRepository.byIds(app.pg, transactionId);

    if (transaction.info) {
      const infoData = {
        blockedAmount: transaction.info.blockedAmount,
        fixedAmount: transaction.info.fixedAmount === undefined ? 0 : transaction.info.fixedAmount,
        transactionId: result.id
      }
      await transactionInfoRepository.create(app.pg, infoData)
    }

    result = transactionRepository.toJson(result)

    await pubsub.publish(
      {
        topic: 'transactionAdded',
        payload: {
          transaction: result
        }
      }
    )
    return result
  }
}

const Subscription = {
  transactionAdded: {
    subscribe: async (obj, args, { pubsub }) => {
      return pubsub.subscribe('transactionAdded')
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
