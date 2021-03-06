'use strict'

const BaseRepository = require('./base')

class CardRepository extends BaseRepository {
  static tableName = 'card'

  static mapFields = {
    valid_from: 'validFrom',
    valid_to: 'validTo',
    currency_code: 'currencyCode'
  };

  static buildWhere () {
    return {
      where: [],
      params: []
    }
  }
}

CardRepository.toJson.bind(CardRepository)

module.exports = CardRepository
