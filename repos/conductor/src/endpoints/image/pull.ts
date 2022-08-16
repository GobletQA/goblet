import { Request, Response } from 'express'
import { AppRouter } from '@gobletqa/conductor/server/routers'


export const pull = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status =  await conductor.pull(req.params.imageRef)

  res.status(200).json(status)
}

AppRouter.post(`/image/pull/:imageRef`, pull)
AppRouter.get(`/image/pull/:imageRef`, pull)
// Only load in a test environment
// process.env.NODE_ENV === `test`
//   && AppRouter.get(`/pull/:imageRef`, pull)
