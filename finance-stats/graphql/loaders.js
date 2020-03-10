'use strict'

const transactionTypeRepository = require('../repository/transaction-type')
const transactionInfoRepository = require('../repository/transaction-info')
const cardRepository = require('../repository/card')
const bankRepository = require('../repository/bank')

function uniqueIds (arr, key) {
  // todo optimize
  return Object.keys(arr.reduce((acc, { obj }) => {
    // todo some id can be string or int
    if (obj[key]) {
      acc[obj[key]] = 1
    }
    return acc
  }, {}))
}

// TODO tbd
function buildLoader (repository, field) {
  return async (parent, { app, req: { user } }) => {
    const ids = uniqueIds(parent, field)
    if (!ids || !ids.length) {
      return []
    }
    const data = await repository.byIds(app.pg, user.id, ids)
    if (!data) {
      return data
    }

    const mapped = data
      .map(repository.toJson.bind(repository))
      .reduce((acc, row) => {
        acc[row.id] = row
        return acc
      }, {})
    return parent.map(({ obj }) => mapped[obj[field]])
  }
}

/*
function buildLoaderMany (repository, findMethod, field, onField) {
  return async (parent, { app }) => {
    const ids = uniqueIds(parent, field)
    if (!ids || !ids.length) {
      return []
    }
    const data = await repository[findMethod](app.pg, ids)
    if (!data) {
      return data
    }
    const mapped = data.reduce((acc, row) => {
      if (!acc[row[onField]]) {
        acc[row[onField]] = []
      }
      acc[row[onField]].push(row)
      return acc
    }, {})
    return parent.map(({ obj }) => mapped[obj[field]])
  }
}
*/

function buildLoaderBelongsTo (repository, findMethod, field, onField) {
  return async (parent, { app }) => {
    const ids = uniqueIds(parent, field)
    if (!ids || !ids.length) {
      return []
    }
    const data = await repository[findMethod](app.pg, ids)
    if (!data) {
      return data
    }
    const mapped = data
      .map(repository.toJson.bind(repository))
      .reduce((acc, row) => {
        if (!acc[row[onField]]) {
          acc[row[onField]] = row
        }
        return acc
      }, {})
    return parent.map(({ obj }) => mapped[obj[field]])
  }
}

const typeLoader = buildLoader(transactionTypeRepository, 'type_id')

module.exports = {
  Transaction: {
    type: typeLoader,
    card: buildLoader(cardRepository, 'card_id'),
    info: buildLoaderBelongsTo(transactionInfoRepository, 'byTransactionIds', 'id', 'transaction_id')
  },
  Stats: {
    type: typeLoader
  },
  Card: {
    bank: buildLoader(bankRepository, 'bank_id')
  }
}
