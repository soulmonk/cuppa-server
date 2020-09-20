const fs = require('fs').promises
const path = require('path')

async function initTable (db) {
  let query = `SELECT COUNT(1) as count
               FROM migrations;`

  try {
    const res = await db.query(query)
    return +res.rows[0].count
  } catch (err) {
    if (err.code !== '42P01') {
      throw err
    }
  }

  query = `CREATE TABLE migrations
           (
               id         serial not null
                   constraint migrations_pk
                       primary key,
               name       varchar(255),
               created_at timestamp default now()
           );
  `
  await db.query(query)

  return 0
}

async function loadMigration (db, count) {
  if (!count) {
    return []
  }
  const { rows } = await db.query(`SELECT name
                             FROM migrations`)

  return rows.map(({ name }) => name)
}

async function getMigrationList (storedMigrations) {
  const dir = await fs.readdir(__dirname)

  // eslint-disable-next-line
  const storedMigrationsMap = storedMigrations.reduce((acc, name) => (acc[name] = 1, acc), {})
  const result = []
  for (const file of dir) {
    if (file === 'index.js' || storedMigrationsMap[file]) {
      continue
    }

    result.push({
      name: file,
      data: await fs.readFile(path.join(__dirname, file), 'utf8')
    })
  }
  return result
}

async function applyMigration (db, migrationFiles) {
  for (const file of migrationFiles) {
    console.log('Start process data:', file.name)
    console.log('Run query:\n', file.data)
    await db.query(file.data)
    await create(db, file.name)
  }
}

async function migration (db) {
  const count = await initTable(db)
  console.log('Stored migrations', count)
  const storedMigrations = await loadMigration(db, count)
  const migrationData = await getMigrationList(storedMigrations)

  console.log('New migrations: ', migrationData.length)

  if (!migrationData.length) {
    return
  }

  return applyMigration(db, migrationData)
}

async function create (db, name) {
  const query = `INSERT INTO migrations (name, created_at)
                 VALUES ($1, now())
                 RETURNING id`

  const result = await db.query(query, [name])
  console.log('Created new record:', result.rows[0].id)
}

module.exports = {
  migration
}
