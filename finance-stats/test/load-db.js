'use strict'

process.env.POSTGRESQL_CONNECTION_STRING = process.env.POSTGRESQL_CONNECTION_STRING || 'postgres://cuppa:toor@localhost/cuppa-finance-stats-test'

const loadConfig = require('../config')
const pg = require('pg')
const { migration } = require('../db/migration')

const fs = require('fs').promises
const path = require('path')

async function run () {
  console.log('Start', new Date())

  const pool = new pg.Pool(loadConfig().pg)

  // todo error: must be owner of schema public
  await pool.query('DROP SCHEMA public CASCADE;')
  await pool.query('CREATE SCHEMA public;')

  await migration(pool)
  const sql = await fs.readFile(path.join(__dirname, 'mock/db.sql'), 'utf8')

  await pool.query(sql)

  await pool.end()

  console.log('Done', new Date())
}

run()
  .catch(err => {
    console.error(err)
    return -1
  })
  .then(process.exit)