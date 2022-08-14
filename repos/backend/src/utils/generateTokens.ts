import jwt from 'jsonwebtoken'

/**
 * Validates the required authentication information exists
 */
 
/**
 * Validates the required authentication information exists
 * @param {Object} config - JWT config defined in the backend.config.js file
 * @param {Object} data - User data to store in the token
 *
 * @returns {Object} - Returns new JWT tokens
 */
export const generateTokens = (config:Record<any, any>, data:Record<any, any>) => {
  const {
    exp,
    secret,
    algorithms,
    refreshExp,
    refreshSecret
  } = config

  // Don't include the token in the refresh data
  // Tokens are longer lived and more likely to get hacked
  const { token, ...refreshData } = data

  return {
    // Add the user data to the jwt token and refresh token
    jwt: jwt.sign(data, secret, { algorithm: algorithms[0], expiresIn: exp }),
    refresh: jwt.sign(refreshData, refreshSecret, { algorithm: algorithms[0], expiresIn: refreshExp }),
  }
}
