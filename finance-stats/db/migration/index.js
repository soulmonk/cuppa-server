const fs = require('fs').promises
const path = require('path')

async function initTable (db) {

}

async function migration (db) {
  await initTable(db)

  const sql = await fs.readFile(path.join(__dirname, '1581120000000_init.sql'), 'utf8')

  await db.query(sql)
}

module.exports = {
  migration
}
