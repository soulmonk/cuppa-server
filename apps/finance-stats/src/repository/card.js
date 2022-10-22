'use strict'

const BaseRepository = require('./base')

class CardRepository extends BaseRepository {
  static tableName = 'card'

  static mapFields = {
    valid_from: 'validFrom',
    valid_to: 'validTo',
    currency_code: 'currencyCode'
  };

  static async create (pg, data) {
    const query = `INSERT INTO "${this.tableName}" ("name", "valid_from", "valid_to", "currency_code", "bank_id", "description", "user_id") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`

    const params = [
      data.name,
      data.validFrom,
      data.validTo,
      data.currencyCode,
      data.bank_id,
      data.description,
      data.userId
    ]

    const { rows } = await pg.query(query, params)

    return { ...data, id: rows[0].id }
  }

  static buildWhere (options, params = [], where = []) {
    return {
      where,
      params
    }
  }
}

CardRepository.toJson.bind(CardRepository)

module.exports = CardRepository
