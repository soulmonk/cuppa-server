'use strict'

const BaseRepository = require('./base')

class TransactionTypeRepository extends BaseRepository {
  static tableName = 'transaction_type'

  static buildWhere () {
    return {
      where: [],
      params: []
    }
  }
}

module.exports = TransactionTypeRepository
