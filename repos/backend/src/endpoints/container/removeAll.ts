import { Request, Response } from 'express'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'


export const removeAll = async (req:Request, res:Response) => {
  const conductor = req.app.locals.conductor
  const status = await conductor.removeAll()
  res.status(200).json(status)
}

// AppRouter.post(`/container/remove-all`, removeAll)