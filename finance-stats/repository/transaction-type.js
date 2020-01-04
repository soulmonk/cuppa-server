'use strict'
const TABLE_NAME = 'transaction_type'

// todo jsdoc
async function byIds (pg, ids) {
  // todo duplicate lines
  const client = await pg.connect()

  let single = false
  if (!Array.isArray(ids)) {
    single = true
    ids = [ids]
  }
  const where = ids.length === 1 ? 'id=' + ids[0] : `id in (${ids})`
  // tod optimise query
  // todo parameters id in ($1).
  const { rows } = await client.query(`SELECT * FROM "${TABLE_NAME}" WHERE ${where}`)
  client.release()

  if (!rows || !rows.length) {
    return
  }

  return single ? rows[0] : rows
}

async function all (pd) {
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
