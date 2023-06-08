import { Request, Response } from 'express'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'


export const removeAll = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status = await conductor.removeAll()
  res.status(200).json(status)
}

// AsyncRouter.post(`/container/remove-all`, removeAll)