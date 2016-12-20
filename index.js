const path = require('path')
const version = 'node-v51'

if (['darwin', 'win32', 'linux'].indexOf(process.platform) === -1) {
    throw new Error('Operating system not compatible')
}

if (process.arch !== 'x64') {
    throw new Error('Arch Type not compatible')
}

const sqlite3 = require(path.join(__dirname, 'sqlite3', `${version}-${process.platform}-${process.arch}`, 'node_sqlite3'))

module.exports = sqlite3
