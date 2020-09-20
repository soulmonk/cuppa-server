const pg = require('pg')
const loadConfig = require('./config')
const { migration } = require('./db/migration')

process.env.POSTGRESQL_CONNECTION_STRING = process.env.POSTGRESQL_CONNECTION_STRING || 'postgres://cuppa:toor@localhost/cuppa-finance-stats'

async function run () {
  console.log('Start', new Date())

  const pool = new pg.Pool(loadConfig().pg)
  await migration(pool)
  await pool.end()
}

run()
  .catch(err => (console.error(err), -1)) // eslint-disable-line
  .then((code) => {
    console.log('Done', new Date())
    process.exit(code)
  })
