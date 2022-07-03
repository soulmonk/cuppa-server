const fs = require('fs').promises
const path = require('path')
const pg = require('pg')
const readline = require('readline')
const { google } = require('googleapis')
const { uniqBy, sortBy, uniq } = require('lodash')

const argv = require('minimist')(process.argv.slice(2))

const loadMapping = require('./mapSheet')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const {
  SPREADSHEET_ID,
  TOKEN_PATH = 'token.json',
  CREDENTIALS_PATH = 'CREDENTIALS_PATH',
  DATA_PATH = path.join(__dirname, 'data'),
  MAPPING = path.join(__dirname, 'mapping/data.js')
} = process.env

async function getCredentials () {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    console.log('Error loading client secret file:', err)
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
async function authorize (credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed /* eslint-disable-line */
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  let token
  try {
    await fs.stat(TOKEN_PATH)
    const content = await fs.readFile(TOKEN_PATH, 'utf8')
    token = JSON.parse(content)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
    token = await getNewToken(oAuth2Client)
    await saveToken(token)
  }

  oAuth2Client.setCredentials(token)

  return oAuth2Client
}

async function saveToken (token) {
  await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
  console.log('Token stored to', TOKEN_PATH)
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getNewToken (oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err)
        resolve(token)
      })
    })
  })
}

async function getAllSheets (sheetsApi) {
  const { data: { sheets } } = await sheetsApi.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID
  })

  return sheets.map(sheet => sheet.properties.title)
}

async function fetchAndSaveRange (sheetsApi, title) {
  const { data: { values: rows } } = await sheetsApi.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: title
  })

  await fs.writeFile(path.join(DATA_PATH, `${title}.json`), JSON.stringify(rows))
}

async function fetchData () {
  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID required')
  }

  if (process.argv[2] === 'convert') {
    return
  }
  const credentials = await getCredentials()
  const auth = await authorize(credentials)
  const sheetsApi = google.sheets({ version: 'v4', auth })

  if (process.argv[2] === 'dump') {
    const sheets = await getAllSheets(sheetsApi)
    console.log('Sheets: ', sheets.join(','))
    return
  }

  let sheets
  if (process.argv[2] === 'only') {
    console.log(`Fetching data for ${process.argv[3]}`)
    sheets = process.argv[3].split(',')
  }

  if (!sheets) {
    sheets = await getAllSheets(sheetsApi)
  }

  for (const title of sheets) {
    console.log(`Sheat name ${title}`)
    await fetchAndSaveRange(sheetsApi, title)
  }
}

async function loadRawData () {
  const files = await fs.readdir(DATA_PATH)
  const dataExt = '.json'

  const rawData = {}
  for (const filename of files) {
    if (path.extname(filename) !== dataExt || filename.startsWith('_')) { continue }

    rawData[path.basename(filename, dataExt)] = require(path.join(DATA_PATH, filename))
  }
  return rawData
}

async function convert () {
  const mapping = await loadMapping(process.env.MAPPING_FOLDER)
  const rawData = await loadRawData()

  const baseParse = (rawRow, title, idx) => {
    return rawRow;
  }

  const data = []
  let categories = []
  for (const title in rawData) {
    const mapper = mapping[title] || mapping.default

    console.log(`Converting "${title}"`)
    rawData[title].shift() // skip title row
    categories = uniq(rawData[title].map(row => row[3]).concat(categories))

    let idx = 0
    for (const rawRow of rawData[title]) {
      const parsed = baseParse(rawRow, title, ++idx)
      const row = mapper(parsed, rawRow)
      data.push(row)
    }
  }
  console.log('Raw categories:', categories.sort())

  return data
}

async function saveTransactionTypes (pool, mapping, categories) {
  async function getAllTransactionTypes () {
    const { rows: storedCategories } = await pool.query(`SELECT id, name
                                                         FROM transaction_type
                                                         WHERE user_id = $1;`, [mapping.userId])
    return storedCategories.reduce((acc, { id, name }) => (acc[name] = id, acc), {}) // eslint-disable-line
  }

  async function saveTransactionTypes () {
    const v = categories.filter(name => !storedCategories[name])
      .map(name => `('${name}', ${mapping.userId})`)
    if (!v.length) {
      return
    }
    const query = `INSERT INTO transaction_type(name, user_id) VALUES ${v.join(',')};`
    return pool.query(query)
  }

  let storedCategories = await getAllTransactionTypes()
  await saveTransactionTypes()
  storedCategories = await getAllTransactionTypes()
  return storedCategories
}

async function store (data) {
  const mapping = require(MAPPING)
  const categories = uniqBy(data, row => row.category).map(row => row.category)

  if (argv.dumpTemp) {
    console.log('categories:', categories)
    await fs.writeFile(path.join(DATA_PATH, '_convertedData.json'), JSON.stringify(sortBy(data, 'date')))
    const additional = data.reduce((acc, data) => {
      if (data.additional.length) acc.push(data)
      return acc
    }, [])
    console.log('additional', additional.length)
    await fs.writeFile(path.join(DATA_PATH, '_withAdditional.json'), JSON.stringify(additional))
  }

  const pool = new pg.Pool(loadConfig().pg)
  const storedCategories = await saveTransactionTypes(pool, mapping, categories)

  let batch = []
  const BATCH_LIMIT = 100

  async function storeBatch () {
    if (!batch || argv.skipStore) {
      return
    }
    console.log('Saving batch', batch.length)

    let values = []
    const v = batch
      .map(({ date, description, amount, typeId, note, cardId, currencyCode, userId }, idx) => {
        values = values.concat([date.toISOString(), description, amount, typeId, note, cardId, currencyCode, userId])
        return `($${(8 * idx) + 1}, $${(8 * idx) + 2}, $${(8 * idx) + 3}, $${(8 * idx) + 4}, $${(8 * idx) + 5}, $${(8 * idx) +
        6}, $${(8 * idx) + 7}, $${(8 * idx) + 8})`
      })
    const query = `INSERT INTO transaction(date, description, amount, type_id, note, card_id, currency_code, user_id)
VALUES ${v.join(',')};`
    return pool.query(query, values)
  }

  for (const row of data) {
    if (batch.length > BATCH_LIMIT) {
      await storeBatch()
      batch = []
    }

    const defaultCurrencyCode = 'UAH'
    let currencyCode
    let cardCurrency
    const CURRENCIES = { USD: 1, UAH: 1, EUR: 1, GBP: 1 }
    let cardId = mapping.cards[defaultCurrencyCode]
    let isCash = false

    if (row.additional.length) {
      for (const additionalElement of row.additional) {
        if (additionalElement.toLowerCase() === 'cash') {
          isCash = true
        }
        if (!currencyCode && CURRENCIES[additionalElement.toUpperCase()]) {
          currencyCode = additionalElement.toUpperCase()
        }
        if (currencyCode && CURRENCIES[additionalElement.toUpperCase()]) {
          cardCurrency = additionalElement.toUpperCase()
          cardId = mapping.cards[cardCurrency]
        }
      }
      if (!isCash && !currencyCode && !cardCurrency) {
        console.warn('could not parse curency in additional', row, isCash, currencyCode, cardCurrency)
      }
    }

    const record = {
      date: row.date,
      description: row.description,
      amount: row.amount,
      note: row.note ?? '',
      typeId: storedCategories[row.category],
      cardId: isCash ? null : cardId,
      currencyCode: currencyCode ?? defaultCurrencyCode,
      userId: mapping.userId
    }
    batch.push(record)
  }
  await storeBatch()

  await pool.end()
}

async function run () {
  console.log('Start', new Date())

  await fetchData()
  const data = await convert()
  await store(data)

  console.log('Done', new Date())
}

run()
  .catch(err => {
    console.error(err)
    return -1
  })
  .then(process.exit)
