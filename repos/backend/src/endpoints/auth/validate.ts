import type { Response, Request } from 'express'

import { hashString } from '@keg-hub/jsutils'
import { apiRes } from '@gobletqa/shared/express/apiRes'
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
  
  // Containers are based on the subdomain generated from username
  // It's important that the subdomain exists here
  // Before calling the conductor.status method

  // Next call conductor to spin of a container for the user
  // Add the token we just generated for authorization
  const status = await conductor.status({
    query: {},
    params: { imageRef },
    body: { ensure: true },
  } as Partial<Request>, res.locals.subdomain)

  // First generate tokens for accessing conductor form the frontend
  const jwtTokens = generateTokens(config.jwt, {
    status,
    userId: id,
    token: token,
    username: username,
    provider: provider,
    subdomain: res.locals.subdomain,
  })


  return apiRes(res, {...jwtTokens, id, username, provider, status }, 200)
}


AsyncRouter.post('/auth/validate', validate)