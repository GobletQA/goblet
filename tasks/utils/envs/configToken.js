const crypto = require('crypto')
const { writeFileSync } = require('fs')
const { get, set } = require('@keg-hub/jsutils')
const { constants, fileSys, error, getKegGlobalConfig } = require('@keg-hub/cli-utils')

const { ensureDirSync } = fileSys
const { GLOBAL_CONFIG_PATHS, GLOBAL_CONFIG_FOLDER, GLOBAL_CONFIG_FILE } = constants

const salt = 'a4E36cDq'
const secretFormat = 'hex'
const algorithm = 'aes-128-cbc'
const iv = crypto.randomBytes(16)

const getKey = (password) => {
  const hash = crypto.createHash("sha1")
  hash.update(password)
  return hash.digest().slice(0, 16)
}

/**
 * Decrypts the passed in string
 * @param {string} data - String to be decrypted
 *
 * @returns {string} - Decrypted string
 */
const decrypt = (str, password) => {
  const strSplit = str.split(':')
  const ivFromKey = Buffer.from(strSplit.shift(), secretFormat);
  const encryptedText = Buffer.from(strSplit.join(':'), secretFormat)

  const key = getKey(password || salt)
  const decipher = crypto.createDecipheriv(algorithm, key, ivFromKey)
  const decrypted = decipher.update(encryptedText)

  return Buffer.concat([decrypted, decipher.final()]).toString()
}

/**
 * Encrypts the passed in string
 * @param {string} str - String to be encrypted
 *
 * @returns {string} - Encrypted string
 */
const encrypt = (str, password) => {
  const key = getKey(password || salt)
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(str)
  const encryptedBuffer = Buffer.concat([encrypted, cipher.final()])

  return iv.toString(secretFormat) + ':' + encryptedBuffer.toString(secretFormat)
}

/**
 * Decrypts the token saved in the global config and returns it
 * @param {string} password - Password to access the token
 * @param {string} token - Value of the token
 *
 * @returns {void}
 */
const getConfigToken = (password=false, throwError=false) => {
  try {
    const globalConfig = getKegGlobalConfig()
    return decrypt(get(globalConfig, `${GLOBAL_CONFIG_PATHS.GIT}.key`), password)
  }
  catch(e){
    throwError && error.throwError(`\n You entered an invalid password!`)
  }
}

/**
 * Encrypts the passed in token then adds it to the global config
 * @param {string} password - Password to access the token
 * @param {string} token - Value of the token
 *
 * @returns {void}
 */
const setConfigToken = (password=false, token) => {
  const globalPath = ensureDirSync(GLOBAL_CONFIG_FOLDER)
  !globalPath && error.throwError(`\n Could not validate global config folder at ${globalPath}!`)

  const globalConfig = getKegGlobalConfig()
  set(globalConfig, `${GLOBAL_CONFIG_PATHS.GIT}.key`, encrypt(token, password))

  writeFileSync(
    path.join(GLOBAL_CONFIG_FOLDER, GLOBAL_CONFIG_FILE),
    JSON.stringify(config, null, 2)
  )
}

module.exports = {
  getConfigToken,
  setConfigToken
}