const transactionRepository = require('../repository/transaction')
const transactionTypeRepository = require('../repository/transaction-type')
const transactionInfoRepository = require('../repository/transaction-info')
const cardRepository = require('../repository/card')

//
const config = {
  currencyCode: 'UAH'
}

module.exports = {
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
    // todo how to validate with graphql
    if (cardId) {
      const card = await cardRepository.byId(app.pg, user.id, cardId)
      if (!card) {
        throw new Error('unknown card')
      }
    }
    // todo create new transaction Type ?
    if (transaction.type) {
      const type = await transactionTypeRepository.byId(app.pg, user.id, transaction.type)
      if (!type) {
        throw new Error('unknown transactionType')
      }
    }

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
    const currencyCode = typeof transaction.currencyCode === 'string' && transaction.currencyCode.length === 3
      ? transaction.currencyCode
      : config.currencyCode

    if (transaction.card) {
      const card = await cardRepository.byId(app.pg, user.id, transaction.card)
      if (!card) {
        throw new Error('unknown card')
      }
    }
    if (transaction.type) {
      const type = await transactionTypeRepository.byId(app.pg, user.id, transaction.type)
      if (!type) {
        throw new Error('unknown type')
      }
    }

    const data = {
      date: typeof transaction.date === 'undefined' || !transaction.date ? null : transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type_id: transaction.type, // todo rename? ###++++### insert or update on table \"transaction\" violates foreign key constraint
      note: typeof transaction.note !== 'string' ? '' : transaction.note,
      currency_code: currencyCode,
      card_id: transaction.card
    }

    await transactionRepository.update(app.pg, user.id, transaction.id, data)
    const result = await transactionRepository.byId(app.pg, user.id, transaction.id)
    await pubsub.publish(
      {
        topic: 'transactionUpdated',
        payload: {
          transaction: result
        }
      }
    )
    return transactionRepository.toJson(result)
  },
  addTransactionType: async (obj, { type }, { app, pubsub, user }) => {
    const result = await transactionTypeRepository.create(app.pg, { ...type, userId: user.id })
    return transactionTypeRepository.toJson(result)
  }
}
