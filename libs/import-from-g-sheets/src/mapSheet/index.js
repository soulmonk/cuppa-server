const fs = require('fs').promises
const path = require('path')

const skipFiles = { '.gitignore': 1, 'index.js': 1, 'base.js': 1 }

async function loadMapping (folder) {
  const mapping = {
    default: row => row
  }

  const files = await fs.readdir(folder)

  for (const filename of files) {
    if (skipFiles[filename]) { continue }

    mapping[path.basename(filename, '.js')] = require(path.join(__dirname, filename))
  }

  return mapping
}

module.exports = loadMapping
