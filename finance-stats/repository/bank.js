'use strict'

const BaseRepository = require('./base')

class BankRepository extends BaseRepository {
  static tableName = 'bank'

  static buildWhere () {
    return {
      where: [],
      params: []
    }
  }
}

module.exports = BankRepository
