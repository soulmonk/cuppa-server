'use strict'

const transactionTypeRepository = require('../repository/transaction-type')

function uniqueIds (arr, key) {
  return Object.keys(arr.reduce((acc, { obj }) => (acc[obj[key]] = 1, acc), {}))
}

async function type (parent, { app }) {
  const ids = uniqueIds(parent, 'type_id')
  const data = await transactionTypeRepository.byIds(app.pg, ids)
  if (!data) {
    return data
  }
  const mapped = data.reduce((acc, row) => (acc[row.id] = row, acc), {})
  return parent.map(({obj}) => mapped[obj.type_id])
}

module.exports = {
  Transaction: {
    type,
    async card () {
      console.log('Transaction.card')
      return []
    },
    async info () {
      console.log('Transaction.info')
      return []
    }
  },
  Stats: {
    type
  },
  Card: {
    async bank () {
      console.log('Card.bank')
      return []
    }
  }
}
