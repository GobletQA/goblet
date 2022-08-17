import type { Response, Request } from 'express'
import { getUserRepos } from '@gobletqa/workflows'
import { generateTokens } from '@GBE/utils/generateTokens'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'


/**
 * Validates the required authentication information exists
 */
export const validate = asyncWrap(async (req:Request, res:Response) => {
  const { conductor } = req.app.locals
  const { id, username, token, provider } = req.body

  if (!id || !username || !token || !provider)
    throw new Error(`Provider metadata is unknown. Please sign in again`)

  const config = req.app.locals.config.server

  // First generate tokens for accessing conductor form the frontend
  const jwtTokens = generateTokens(config.jwt, {
    userId: id,
    token: token,
    username: username,
    provider: provider,
  })

  // Next call conductor to spin of a container for the user
  // Add the token we just generated for authorization
  const status = await conductor.status({
    headers: { authorization: `Bearer ${jwtTokens.jwt}`}
  })

  // While the container is spinning up
  // Get the users repos from the git provider
  const repos = await getUserRepos({ token })

  return apiRes(res, {...jwtTokens, id, username, provider, status, repos}, 200)

})


AppRouter.post('/auth/validate', validate)