const fs = require('fs-extra')
const path = require('path')
const https = require('https')
const decompress = require('decompress')

// NODE
// Support platform
// Windows x64 & ia32
// MacOSX x64
// Linux x64
const PLATFORMS = ['darwin', 'linux', 'win32'] // process.platform
const ARCHS = ['ia32', 'x64', 'x86'] // process.arch

/**
 * getVersion directly from GitHub repo package.json
 *
 * @returns {Promise<string>} version
 * @example
 * const version = await getVersion()
 * //= '5.0.2'
 */
function getVersion () {
  const url = 'https://raw.githubusercontent.com/mapbox/node-sqlite3/master/package.json'
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.setEncoding('utf8')
      if (res.statusCode !== 200) return reject(res.statusMessage)
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        const packageJson = JSON.parse(data)
        resolve({version: packageJson.version, napiVersion: packageJson.binary.napi_versions[0]})
      })
    })
  })
}

/**
 * getName
 *
 * @param {string} napiVersion
 * @param {string} platform
 * @param {string} arch
 * @return {string}
 * @example
 * const name = getName(46, 'linux', 'x64')
 * //= 'napi-v3-linux-x64'
 */
function getName (napiVersion, platform, arch) {
  return `napi-v${napiVersion}-${platform}-${arch}`
}

/**
 * getUrl
 *
 * @param {string} version
 * @param {string} name
 * @returns {string} url
 * @example
 * //= 'https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v5.0.2/napi-v3-linux-x64.tar.gz'
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
    }).on('error', (e) => console.log('download error', e))
  })
}

/**
 * Update Binaries Scripts
 */
async function main () {
  const {version, napiVersion} = await getVersion()

    for (const PLATFORM of PLATFORMS) {
      for (const ARCH of ARCHS) {
        const name = getName(napiVersion, PLATFORM, ARCH)
        const filename = name + '.tar.gz'
        const url = getUrl(version, name)
        const binary = await download(url).catch(error => console.error(error, url))
        if (binary) {
          console.info(`Success ${url}`)
          fs.writeFileSync(filename, binary)
          await decompress(filename, path.join(__dirname, '..', 'binaries', `sqlite3-${PLATFORM}`))
          fs.removeSync(filename)
        }
      }
    }

}
main()
