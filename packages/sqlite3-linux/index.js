const path = require('path')
const fs = require('fs')

const PLATFORM = process.platform
const ARCH = process.arch
const MODULES = process.versions.modules
const NODE = process.versions.node
const NAME = `node-v${MODULES}-${PLATFORM}-${ARCH}`

if (fs.existsSync(path.join(__dirname, NAME))) {
  const sqlite3 = require(path.join(__dirname, NAME, 'node_sqlite3'))
  module.exports = sqlite3
} else {
  throw new Error(`NodeJS ${NODE} Module ${MODULES} not compatible`)
}
