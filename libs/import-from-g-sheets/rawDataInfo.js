const fs = require('fs').promises
const path = require('path')
const _ = require('lodash')

const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, 'data')

async function run () {
  console.log('Start', new Date())

  const title = process.argv[2]

  const data = JSON.parse(await fs.readFile(path.join(DATA_PATH, `${title}.json`), 'utf8'))

  const categories = _.uniqBy(data, row => row.category).map(row => row.category)

  console.log('categories: ', categories)
  // console.log('categories: ', categories.reduce((acc, c) => {
  //   acc[c] = c;
  //   return acc;
  // }, {}))
  console.log('total:', data.reduce((acc, { amount }) => acc + amount, 0))
  //
  // const additional = data.reduce((acc, data) => {
  //   if (data.additional.length)
  //     acc.push(data)
  //   return acc
  // }, [])
  // console.log('additional', additional.length)
  // await fs.writeFile(path.join(DATA_PATH, '_withAdditional.json'), JSON.stringify(additional))

  console.log('Done', new Date())
}

run()
  .catch(err => {
    console.error(err)
    return -1
  })
  .then(process.exit)
