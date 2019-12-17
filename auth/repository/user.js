'use strict'

// todo jsdoc
async function getUserByName (pg, username) {
  // todo duplicate lines
  const client = await pg.connect()
  // tod optimise query
  const { rows } = await client.query('SELECT * FROM "user" WHERE name=$1 limit 1', [
    username
  ])
  client.release()

  return rows && rows.length && rows[0]
}

module.exports = {
  getUserByName
}
