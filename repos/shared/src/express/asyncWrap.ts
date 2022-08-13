import { apiErr } from './apiErr'
import { isFunc } from '@keg-hub/jsutils'

/**
 * Wraps a request handler in a try/catch
 * If the handler throws, the passed in errorHandler or default handler is called
 * @param {function} handler - Request handler method ( Controller method )
 * @param {function} errHandler - Custom error handler method
 *
 * @returns {function} - Wrapped handler method
 */
export const asyncWrap = (
  handler: (...args:any) => any,
  errHandler=apiErr
) => (async (...args) => {
  try {
    await handler(...args)
  }
  catch (err) {
    // @ts-ignore
    const wrapErrHandler = asyncWrap?.errHandler
    const errMethod = wrapErrHandler || errHandler || args[2]

    isFunc(errMethod) &&
      errMethod(err, err.status || err.statusCode || 400, ...args)
  }
})

