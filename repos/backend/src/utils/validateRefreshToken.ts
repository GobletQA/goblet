import jwt from 'jsonwebtoken'
import { Logger } from './logger'
import { generateTokens } from './generateTokens'

/**
 * Validates the passed in refresh token, and if valid creates new JWT tokens
 * Ensures the refreshToken data matches the current tokens data
 * @param {Object} config - JWT config defined in the backend.config.js file
 * @param {Object} user - User object parsed from the original JWT token
 * @param {string} refreshToken - Old refresh token used to validate against the user object
 *
 * @returns {Object|boolean} - Returns new JWT tokens or false it token is invalid
 */
export const validateRefreshToken = (
  config:Record<any, any>,
  user:Record<any, any>,
  refreshToken:string
) => {
  const { refreshSecret } = config
  let decoded:any

  try {
    Logger.verbose(`Attempting to decoded refresh token...`)
    decoded = jwt.verify(refreshToken, refreshSecret) as any
    Logger.verbose(`Decoded refresh token successfully`)
  }
  catch(decodeErr){
    Logger.error(`Error validating refreshToken...`)
    !refreshToken && Logger.warn(`Refresh token missing`)
    !refreshSecret && Logger.warn(`Refresh secret missing`)

    Logger.error(decodeErr)

    return false
  }


  try {

    Logger.verbose(`Attempting to generate new token...`)
    const generated = decoded.userId === user.userId
      && decoded.username === user.username
      && decoded.provider === user.provider
      && generateTokens(config, user)
    Logger.verbose(`New token generated successfully`)

    return {
      ...generated,
      ...decoded,
    }

  }
  catch(err){
    Logger.error(`Error generating new token...`)
    Logger.error(err)

    return false
  }
}
