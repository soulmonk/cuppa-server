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

const Query = {
  transaction: async (obj, { id }, { app, user }) => {
    return transactionRepository.byId(app.pg, user.id, id)
      .then(transactionRepository.toJson.bind(transactionRepository))
  },
  transactions: async (obj, inputs, { app, user }) => {
    return transactionRepository.all(app.pg, user.id, inputs)
      .then(res => res.map(transactionRepository.toJson.bind(transactionRepository)))
  },
  transactionTypes: async (obj, args, { app, user }) => {
    return transactionTypeRepository.all(app.pg, user.id)
  },
  cards: async (obj, args, { app, user }) => {
    return cardRepository.all(app.pg, user.id)
      .then(res => res.map(cardRepository.toJson.bind(cardRepository)))
  },
  banks: async (obj, args, { app, user }) => {
    return bankRepository.all(app.pg, user.id)
  },
  total: async (obj, args, ctx) => {
    return []
  }
}

const Mutation = {
  addTransaction: async (obj, { transaction }, { app, pubsub, user }) => {
    // todo validate input
    // todo TZ
    // todo fetch Exchange rate for date

    // db transaction

    // todo load user default currencyCode
    const currencyCode = typeof transaction.currencyCode === 'string' && transaction.currencyCode.length === 3
      ? transaction.currencyCode
      : config.currencyCode

    // todo insert or update on table \"transaction\" violates foreign key constraint
    const cardId = transaction.card && !isNaN(Number(transaction.card)) && Number(transaction.card) > 0 ? transaction.card : null

    const data = {
      date: typeof transaction.date === 'undefined' || !transaction.date ? 'now()' : transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type_id: transaction.type, // todo rename? ###++++### insert or update on table \"transaction\" violates foreign key constraint
      note: typeof transaction.note !== 'string' ? '' : transaction.note,
      currency_code: currencyCode,
      card_id: cardId,
      user_id: user.id
    }

    let result = await transactionRepository.create(app.pg, data)
    // no need
    // const result = await transactionRepository.byIds(app.pg, transactionId);

    if (transaction.info) {
      const infoData = {
        blockedAmount: transaction.info.blockedAmount,
        fixedAmount: transaction.info.fixedAmount ?? 0,
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
  },
  updateTransaction: async (obj, { transaction }, { app, pubsub, user }) => {
    throw new Error('Not implemented')
  },
  addTransactionType: async (obj, { type }, { app, pubsub, user }) => {
    const result = await transactionTypeRepository.create(app.pg, { ...type, userId: user.id })
    return transactionTypeRepository.toJson(result)
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
