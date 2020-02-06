'use strict'

const BaseRepository = require('./base')

class TransactionRepository extends BaseRepository {
  static tableName = 'transaction'

  static async create(transaction) {

  }

  static buildWhere (options, params = [], where = []) {
    if (options.dateFrom) {
      params.push(options.dateFrom)
      where.push('date > $' + params.length)
    }
    if (options.dateTo) {
      params.push(options.dateTo)
      where.push('date < $' + params.length)
    }

    return {
      params,
      where
    }
  }
}

module.exports = TransactionRepository
