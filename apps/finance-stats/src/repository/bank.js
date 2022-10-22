'use strict'

const BaseRepository = require('./base')

class BankRepository extends BaseRepository {
  static tableName = 'bank'

  static async create (pg, data) {
    const query = `INSERT INTO "${this.tableName}" ("name", "url", "user_id") VALUES ($1, $2, $3) RETURNING id`

    const params = [
      data.name,
      data.url,
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

module.exports = BankRepository
