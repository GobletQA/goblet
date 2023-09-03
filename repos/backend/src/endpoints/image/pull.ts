import { Request, Response } from 'express'
import { AsyncRouter } from '@gobletqa/shared/api/express/appRouter'

export const pull = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status =  await conductor.pull(req.params.imageRef)

  res.status(200).json(status)
}

AsyncRouter.post(`/image/pull/:imageRef`, pull)
AsyncRouter.get(`/image/pull/:imageRef`, pull)
// Only load in a test environment
// process.env.NODE_ENV === `test`
//   && AsyncRouter.get(`/pull/:imageRef`, pull)
