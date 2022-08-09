/**
 * Builds the request headers for calling github Api V3
 * Adds the Authorization header when the token exists
 *
 * @returns {Object} - Request header object
 */
export const buildHeaders = (token:string) => ({
  ...(token && { Authorization: `token ${token}` }),
  'Content-Type': 'application/json',
  Accept: `application/vnd.github.v3+json`,
})

