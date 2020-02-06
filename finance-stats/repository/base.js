'use strict'

class BaseRepository {
  static tableName = '';

  static async _select(client, {where = '', params = [], fields = []}) {
    let query = 'SELECT '
    if (fields.length) {
      query += `"${fields.join('", "')}"`
    } else {
      query += '*'
    }

    query += ` FROM "${this.tableName}"`

    if (where.length) {
      query += ` WHERE ${where}`
    }

    // TODO add logger
    console.log('query: ', query, '\nparams: ', params)

    return client.query(query, params);
  }

  static async byIds (pg, ids) {
    // todo duplicate lines
    const client = await pg.connect()

    let single = false
    if (!Array.isArray(ids)) {
      single = true
      ids = [ids]
    }
    // TODO posgresql task1
    let where = ids.length === 1 ? 'id=$1' : `id in (${ids.join(',')})`
    // todo multiple ids as parameter
    const params = ids.length === 1 ? ids : []

    // todo optimise query (instead "*" specific fields from request)
    const { rows } = await this._select(client, {where, params})
    client.release()

    let res = rows
    if (!rows || !rows.length) {
      res = []
    }

    return single ? res[0] : res
  }

  static buildWhere (options, params = [], where = []) {
    throw new Error('Not implemented')
  }

  static async all (pg, options = {}) {
    // todo duplicate lines
    const client = await pg.connect()

    let query = `SELECT * FROM "${this.tableName}"`

    const { where, params } = this.buildWhere(options)

    if (where.length) {
      query += ' WHERE ' + where.join(' and ')
    }

    if (options.limit) {
      params.push(options.limit)
      query += ' Limit $' + params.length
    }

    if (options.offset) {
      params.push(options.offset)
      query += ' Skip $' + params.length
    }

    console.log('query: ', query)
    console.log('params: ', params)

    // tod optimise query
    const { rows } = await client.query(query, params)
    client.release()

    return rows && rows.length ? rows : []
  }

}

module.exports = BaseRepository
