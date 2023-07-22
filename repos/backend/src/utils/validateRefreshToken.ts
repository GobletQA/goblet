import jwt from 'jsonwebtoken'
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

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret) as any

    const generated = decoded.userId === user.userId
      && decoded.username === user.username
      && decoded.provider === user.provider
      && decoded.subdomain === user.subdomain
      && generateTokens(config, user)

    return {
      ...generated,
      ...decoded
    }

  }
  catch(err){
    console.log(`Error in refresh...`)
    console.log(err)
    
    return false
  }
}
