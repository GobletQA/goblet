import type { Request } from 'express'

/**
 * Resolves the origin from the passed in headers
 * @param {Object} req - Express request object
 */
export const getOrigin = (req:Request) => {
  return (
    req.headers.origin ||
    (req.headers.referer && new URL(req?.headers?.referer).origin) ||
    (req.headers.host &&
      req.protocol &&
      `${req.protocol}://${req?.headers?.host?.split(':').shift()}`)
  )
}
