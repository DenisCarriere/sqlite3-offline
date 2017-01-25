var sqlite3 = require('./')

describe('sqlite3', () => {
  test(':memory:', () => expect(new sqlite3.Database(':memory:')).toBeDefined())
})
