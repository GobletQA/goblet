const jwt = require('jsonwebtoken')
const { Repo } = require('@gobletqa/shared/repo/repo')
const { generateTokens } = require('@GBE/utils/generateTokens')
const { asyncWrap, apiRes } = require('@gobletqa/shared/express')

/**
 * Validates the required authentication information exists
 */
const validate = asyncWrap(async (req, res) => {
  const { id, username, token, provider } = req.body

  if (!id || !username || !token || !provider)
    throw new Error(`Provider metadata is unknown. Please sign in again`)

  const config = req.app.locals.config.server

  // Add the user data to the jwt
  const jwtTokens = generateTokens(config.jwt, {
    userId: id,
    token: token,
    username: username,
    provider: provider,
  })

  // Preload the users repos from the provider
  const repos = await Repo.getUserRepos({ token })

  return apiRes(res, {...jwtTokens, id, username, provider, repos}, 200)
})

module.exports = {
  validate,
}
