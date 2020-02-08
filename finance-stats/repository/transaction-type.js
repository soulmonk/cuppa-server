'use strict'

const BaseRepository = require('./base')

class TransactionTypeRepository extends BaseRepository {
  static tableName = 'transaction_type'

  static async create (pg, data) {
    const query = `INSERT INTO "${this.tableName}" ("name", "description", "user_id") VALUES ($1, $2, $3) RETURNING id`

    const params = [
      data.name,
      data.description,
      data.user_id
    ]
    console.log('transaction-type.js::create::16 >>>', '\nquery: ', query, '\nparams: ', params, '\nEND')

    const { rows } = await pg.query(query, params)
    console.log('transaction-type.js::create::20 >>>', rows)

    return { ...data, id: rows[0].id }
  }

  static buildWhere () {
    return {
      where: [],
      params: []
    }
  }
}

module.exports = TransactionTypeRepository
