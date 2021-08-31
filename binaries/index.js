const path = require('path')
const fs = require('fs')

const PLATFORM = process.platform
const ARCH = process.arch
const MODULES = process.versions.modules
const NODE = process.versions.node
const NAPI_VERSION = 3

const NAME = `napi-v${NAPI_VERSION}-${PLATFORM}-${ARCH}`
if (parseInt(NODE.split('\.')[0]) >= 11 && fs.existsSync(path.join(__dirname, 'sqlite3-' + PLATFORM, NAME))) {
  const sqlite3 = require(path.join(__dirname, 'sqlite3-' + PLATFORM, NAME, 'node_sqlite3.node'))
  module.exports = sqlite3
} else {
  throw new Error(`NodeJS ${NODE} Module ${MODULES} not compatible`)
}
