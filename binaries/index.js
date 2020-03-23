const path = require('path')
const fs = require('fs')

const PLATFORM = process.platform
const ARCH = process.arch
const MODULES = process.versions.modules
const NODE = process.versions.node
const ELECTRON = process.versions.electron

var NAME
if (ELECTRON) {
  const MINOR_RELEASE = ELECTRON.match(/\d\.\d/)[0]
  if (!MINOR_RELEASE) throw new Error('Electron', ELECTRON, 'release not supported')
  NAME = `electron-v${MINOR_RELEASE}-${PLATFORM}-${ARCH}`
} else NAME = `node-v${MODULES}-${PLATFORM}-${ARCH}`

if (fs.existsSync(path.join(__dirname, 'sqlite3-' + PLATFORM, NAME))) {
  const sqlite3 = require(path.join(__dirname, 'sqlite3-' + PLATFORM, NAME, 'node_sqlite3.node'))
  module.exports = sqlite3
} else {
  throw new Error(`NodeJS ${NODE} Module ${MODULES} not compatible`)
}
