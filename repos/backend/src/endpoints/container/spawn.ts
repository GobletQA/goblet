import type { Response } from 'express'
import type { TBEDefReq, TSpawnOpts } from '@GBE/types'

import { apiRes, AppRouter } from '@gobletqa/shared/api'

type TBEParams = {
  imageRef:string
}

export const spawn = async (req:TBEDefReq<TBEParams, TSpawnOpts>, res:Response) => {
  const conductor = req.app.locals.conductor

  const status = await conductor.spawn(
    req.params.imageRef,
    req.body,
    res.locals.subdomain
  )

  return apiRes(res, status)
}

AppRouter.post(`/container/spawn/:imageRef`, spawn)
AppRouter.get(`/container/spawn/:imageRef`, spawn)

// Only load in a test environment
// process.env.NODE_ENV === `test`
//   && AppRouter.get(`/container/spawn/:imageRef`, spawn)