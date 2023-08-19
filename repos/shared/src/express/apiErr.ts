import type { TError } from '../types'
import type { Response } from 'express'

import { ApiLogger } from '@gobletqa/logger'
import { isObj } from '@keg-hub/jsutils/isObj'
import { toNum } from '@keg-hub/jsutils/toNum'


export const apiErr = (res:Response, err:TError, status:number) => {
  const error = {
    message: isObj(err) ? err.message : err || `An api error occurred!`,
  }

  ApiLogger.error(err?.stack || err?.message)

  if(res.headersSent) return

  res.statusCode = toNum(err.statusCode || status || 400)
  res.json(error)
}
