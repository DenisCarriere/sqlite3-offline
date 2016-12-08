const version = 'node-v51'

interface Sqlite3 {
  Database(key: any): any
  Statement(key: any): any
}

if (['darwin', 'win32', 'linux'].indexOf(process.platform) === -1) { throw new Error('Operating system not compatible') }
if (['x64'].indexOf(process.arch) === -1) { throw new Error('Arch Type not compatible') }

const sqlite3: Sqlite3 = require(`./${version}-${process.platform}-${process.arch}/node_sqlite3`)
export = sqlite3
