# SQLite3 for offline

[![Build Status](https://travis-ci.org/DenisCarriere/sqlite3-offline.svg?branch=master)](https://travis-ci.org/DenisCarriere/sqlite3-offline)
[![npm version](https://badge.fury.io/js/sqlite3-offline.svg)](https://badge.fury.io/js/sqlite3-offline)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/sqlite3-offline/master/LICENSE)

<!-- Line Break -->
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Bundled library for [SQLite3](https://github.com/mapbox/node-sqlite3) for offline deployments.
>
> Zero dependencies, zero external HTTP downloads.

## Install

```bash
$ npm install --save sqlite3-offline
```

## Quickstart

```javascript
const sqlite3 = require('sqlite3-offline').verbose()
var db = new sqlite3.Database(':memory:')

db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)")

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)")
  for (var i = 0; i < 10; i++) {
    stmt.run("Ipsum " + i)
  }
  stmt.finalize()

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    console.log(row.id + ": " + row.info)
  })
})

db.close()
```

## Supported Platforms

- Windows x64 & ia32
- MacOSX x64
- Linux x64
- Electron
  - v1.5
  - v1.6
  - v1.7
  - v8.2

## Supported NodeJS Release

- Node.js v13 (79)
- Node.js v12 (72)
- Node.js v11 (69)
- Node.js v10 (64)
- Node.js v9 (59)
- Node.js v8
- Node.js v7
- Node.js v6
- Node.js v5
- Node.js v4

## Related

- [mbtiles-offline](https://github.com/DenisCarriere/mbtiles-offline)

## License

BSD © [Mapbox](https://github.com/mapbox/node-sqlite3)
