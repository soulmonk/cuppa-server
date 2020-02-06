'use strict'

const BaseRepository = require('./base')

class CardRepository extends BaseRepository {
  static tableName = 'card'

  static buildWhere () {
    return {
      where: [],
      params: []
    }
  }
}

module.exports = CardRepository
