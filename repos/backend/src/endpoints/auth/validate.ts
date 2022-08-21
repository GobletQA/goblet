import type { Response, Request } from 'express'

import { hashString } from '@keg-hub/jsutils'
import { apiRes } from '@gobletqa/shared/express'
import { getUserRepos } from '@gobletqa/workflows'
import { generateTokens } from '@GBE/utils/generateTokens'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'


/**
 * Validates the required authentication information exists
 */
export const validate = async (req:Request, res:Response) => {
  const { conductor } = req.app.locals
  const { id, username, token, provider } = req.body
  const imageRef = Object.keys(conductor.config.images).shift()

  if (!id || !username || !token || !provider)
    throw new Error(`Provider metadata is unknown. Please sign in again`)

  const config = req.app.locals.config.server
  
  res.locals.subdomain = hashString(`${username}-${config?.conductor?.hashKey}`)

  // First generate tokens for accessing conductor form the frontend
  const jwtTokens = generateTokens(config.jwt, {
    userId: id,
    token: token,
    username: username,
    provider: provider,
    subdomain: res.locals.subdomain,
  })

  // Next call conductor to spin of a container for the user
  // Add the token we just generated for authorization
  const status = await conductor.status({
    query: {},
    params: { imageRef },
    body: { ensure: true },
  } as Partial<Request>)

  // While the container is spinning up
  // Get the users repos from the git provider
  const repos = await getUserRepos({ token })

  return apiRes(res, {...jwtTokens, id, username, provider, status, repos}, 200)

}


AsyncRouter.post('/auth/validate', validate)