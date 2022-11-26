import type { Express } from 'express'
import jwt from 'jsonwebtoken'
import type { TSocketTokenData, TSocketEvtCBProps } from '@GSC/types'

type TTokenCB = (...args:any[]) => any

/**
 * Validates the passed in refresh token, and if valid creates new JWT tokens
 * Ensures the refreshToken data matches the current tokens data
 * @param {Object} config - JWT config defined in the backend.config.js file
 * @param {Object} user - User object parsed from the original JWT token
 * @param {string} refreshToken - Old refresh token used to validate against the user object
 *
 * @returns {Object|boolean} - Returns new JWT tokens or false it token is invalid
 */
export const validateToken = (app:Express, callback:TTokenCB) => {
  const { secret } = app?.locals?.config?.server?.jwt
  return (args:TSocketEvtCBProps) => {
    const { data, Manager, socket } = args
    try {
      return callback?.(args, jwt.verify(data?.jwt, secret) as TSocketTokenData)
    }
    catch(err){
      console.log(err.stack)
      
      callback?.(args, { error:err } as TSocketTokenData)
      
      // TODO: Emit an invalid token error
      // Manager.emit(socket, `INVALID-TOKEN`, { message: `INVALID-TOKEN`, group: socket.id })
      return false
    }
  }
}
