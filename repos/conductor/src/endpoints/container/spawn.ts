import { Request, Response } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/conductor/server/routers'

export const spawn = asyncWrap(async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor

  const status = await conductor.spawn(
    req.params.imageRef,
    req.body,
    res.locals.subdomain
  )

  return apiRes(res, status)
})

AppRouter.post(`/container/spawn/:imageRef`, spawn)
// TODO: remove this, it should only be used temporarly
AppRouter.get(`/container/spawn/:imageRef`, spawn)