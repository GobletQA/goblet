import { Request, Response } from 'express'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { AsyncRouter } from '@gobletqa/shared/api/express/appRouter'

export const spawn = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor

  const status = await conductor.spawn(
    req.params.imageRef,
    req.body,
    res.locals.subdomain
  )

  return apiRes(res, status)
}

AsyncRouter.post(`/container/spawn/:imageRef`, spawn)
AsyncRouter.get(`/container/spawn/:imageRef`, spawn)

// Only load in a test environment
// process.env.NODE_ENV === `test`
//   && AsyncRouter.get(`/container/spawn/:imageRef`, spawn)