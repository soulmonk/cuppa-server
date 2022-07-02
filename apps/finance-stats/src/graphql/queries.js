const transactionRepository = require('../repository/transaction')
const transactionTypeRepository = require('../repository/transaction-type')
const cardRepository = require('../repository/card')
const bankRepository = require('../repository/bank')

module.exports = {
  transaction: async (obj, { id }, { app, user }) => {
    return transactionRepository.byId(app.pg, user.id, id)
      .then(transactionRepository.toJson.bind(transactionRepository))
  },
  transactions: async (obj, inputs, { app, user }) => {
    // todo order as inputs
    return transactionRepository.all(app.pg, user.id, { order: { date: 'desc' }, ...inputs })
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
  total: async (obj, inputs, { app, user }) => {
    const res = await transactionRepository.total(app.pg, user.id, inputs)
    return res.map(transactionRepository.toJson.bind(transactionRepository))
  }
}
