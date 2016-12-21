const path = require('path')

const PLATFORM = process.platform
const ARCH = process.arch
const MODULES = process.versions.modules
const NODE = process.versions.node

if (['darwin', 'win32', 'linux'].indexOf(PLATFORM) === -1) {
    throw new Error(`Operating system ${platform} not compatible`)
}

if (ARCH !== 'x64') {
    throw new Error(`Arch ${ARCH} not compatible`)
}

if (['51', '48', '47', '46'].indexOf(MODULES) === -1) {
    throw new Error(`NodeJS ${NODE} Module ${MODULES} not compatible`)
}

const name = `node-v${MODULES}-${PLATFORM}-${ARCH}`
const sqlite3 = require(path.join(__dirname, name, 'node_sqlite3'))

module.exports = sqlite3
