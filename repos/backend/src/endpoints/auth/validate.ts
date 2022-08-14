import type { Response, Request } from 'express'

import { Repo } from '@gobletqa/shared/repo/repo'
import { generateTokens } from '@GBE/utils/generateTokens'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Validates the required authentication information exists
 */
export const validate = asyncWrap(async (req:Request, res:Response) => {
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


AppRouter.post('/auth/validate', validate)