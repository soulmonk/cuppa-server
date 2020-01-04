'use strict'
const TABLE_NAME = 'transaction'

// todo jsdoc
async function byIds (pg, ids) {
  // todo duplicate lines
  const client = await pg.connect()

  let single = false
  if (!Array.isArray(ids)) {
    single = true
    ids = [ids]
  }
  let where = ids.length === 1 ? 'id=$1' : 'id in ($1)'
  // tod optimise query
  const { rows } = await client.query(`SELECT * FROM "${TABLE_NAME}" WHERE ${where}`, [
    ids.join(',')
  ])
  client.release()

  let res = rows
  if (!rows || !rows.length) {
    res = []
  }

  return single ? res[0] : res
}

async function all (pg) {
  // todo duplicate lines
  const client = await pg.connect()
  // tod optimise query
  const { rows } = await client.query(`SELECT * FROM "${TABLE_NAME}"`)
  client.release()

  return rows && rows.length ? rows : []
}

module.exports = {
  byIds,
  all
}
