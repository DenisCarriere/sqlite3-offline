const fs = require('fs-extra')
const path = require('path')
const https = require('https')
const decompress = require('decompress')

const MODULES = [46, 47, 48, 50, 51, 53, 57] // process.versions.modules
const PLATFORMS = ['darwin', 'linux', 'win32'] // process.platform
const ARCHS = ['ia32', 'x64', 'x86'] // process.arch

/**
 * getVersion directly from GitHub repo package.json
 *
 * @returns {Promise<string>} version
 * @example
 * const version = await getVersion()
 * //= '3.1.8'
 */
function getVersion () {
  const url = 'https://raw.githubusercontent.com/mapbox/node-sqlite3/master/package.json'
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.setEncoding('utf8')
      if (res.statusCode !== 200) return reject(res.statusMessage)
      res.on('data', chunk => { data += chunk })
      res.on('end', () => resolve(JSON.parse(data).version))
    })
  })
}

/**
 * getName
 *
 * @param {number} modules
 * @param {string} platform
 * @param {string} arch
 * @return {string}
 * @example
 * const name = getName(46, 'linux', 'x64')
 * //= 'node-v46-linux-x64'
 */
function getName (modules, platform, arch) {
  return `node-v${modules}-${platform}-${arch}`
}

/**
 * getUrl
 *
 * @param {string} version
 * @param {string} name
 * @returns {string} url
 * @example
 * getUrl('3.1.8', 'node-v46-linux-x64')
 * //= 'https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v3.1.8/node-v46-linux-x64.tar.gz'
 */
function getUrl (version, name) {
  return `https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v${version}/${name}.tar.gz`
}

/**
 * getS3
 *
 * @param {string} version
 * @param {string} name
 * @returns {{Bucket: string, Key: string}} S3 Bucket param
 * @example
 * getS3('3.1.8', 'node-v46-linux-x64')
 * //= { Bucket: 'mapbox-node-binary', Key: `sqlite3/v3.1.8/node-v46-linux-x64.tar.gz` }
 */
function getS3 (version, name) { // eslint-disable-line
  return {
    Bucket: 'mapbox-node-binary',
    Key: `sqlite3/v${version}/${name}.tar.gz`
  }
}

function download (url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const buffer = []
      if (res.statusCode !== 200) return reject(res.statusMessage)
      res.on('data', data => buffer.push(data))
      res.on('end', () => resolve(Buffer.concat(buffer)))
    })
  })
}

/**
 * Update Binaries Scripts
 */
async function main () {
  const version = await getVersion()

  for (const MODULE of MODULES) {
    for (const PLATFORM of PLATFORMS) {
      for (const ARCH of ARCHS) {
        const name = getName(MODULE, PLATFORM, ARCH)
        const filename = name + '.tar.gz'
        const url = getUrl(version, name)
        const binary = await download(url).catch(error => console.error(error, url))
        if (binary) {
          console.info(`Success ${url}`)
          fs.writeFileSync(filename, binary)
          await decompress(filename, path.join(__dirname, '..', 'packages', `sqlite3-${PLATFORM}`))
          fs.removeSync(filename)
        }
      }
    }
  }
}
main()
