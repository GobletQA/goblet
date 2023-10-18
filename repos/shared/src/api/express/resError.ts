/**
 * Helper to add a status code of a response to an Error instance
 * @param {string} message - The error message
 * @param {number} [statusCode=400] - The response status code
 * @param {boolean} [throwErr=true] - Should the error be thrown or returned
 */
export const resError = (message:string, statusCode:number, throwErr = true) => {
  // TODO: Create an Error class that extends Error, and allows status code
  const error = new Error(message || `Failed to complete request`)
  // @ts-ignore
  error.statusCode = statusCode || 400

  if (throwErr) throw error

  return error
}
