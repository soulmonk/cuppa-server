'use strict'

const BaseRepository = require('./base')

class BankRepository extends BaseRepository {
  static tableName = 'bank'
}

module.exports = BankRepository
