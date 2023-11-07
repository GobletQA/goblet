import type { Response } from 'express'
import type { TBEDefReq } from '@GBE/types'


export const removeAll = async (req:TBEDefReq, res:Response) => {
  const conductor = req.app.locals.conductor
  const status = await conductor.removeAll()
  res.status(200).json(status)
}

// AppRouter.post(`/container/remove-all`, removeAll)