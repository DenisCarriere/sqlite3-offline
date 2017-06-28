const test = require('tape')
const sqlite3 = require('./')

test('sqlite3-offline', t => {
  const db = new sqlite3.Database(':memory:')
  t.assert(db)
  t.end()
})
