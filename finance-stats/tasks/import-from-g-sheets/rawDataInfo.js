const fs = require('fs').promises
const path = require('path')
const _ = require('lodash')

const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, 'data')

async function run () {
  console.log('Start', new Date())

  const title = process.argv[2]

  const data = JSON.parse(await fs.readFile(path.join(DATA_PATH, `${title}.json`), 'utf8'))
  const titles = data.shift()

  const categories = _.uniqBy(data, row => row[3]).map(row => row[3])

  console.log('Titles: ', titles)
  console.log('categories: ', categories)

  console.log('Done', new Date())
}

run()
  .catch(err => {
    console.error(err)
    return -1
  })
  .then(process.exit)
