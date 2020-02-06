'use strict'

const BaseRepository = require('./base')

class TransactionInfoRepository extends BaseRepository {
  static tableName = 'transaction_info'

  static buildWhere () {
    return {
      where: [],
      params: []
    }
  }
}

module.exports = TransactionInfoRepository
