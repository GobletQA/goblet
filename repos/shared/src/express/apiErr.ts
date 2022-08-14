import { Logger } from '@keg-hub/cli-utils'
import { isObj, toNum } from '@keg-hub/jsutils'
import type { Response, Request } from 'express'

type TError = Error & {
  statusCode:number
}

export const apiErr = (res:Response, err:TError, status:number) => {
  const error = {
    message: isObj(err) ? err.message : err || `An api error occurred!`,
  }

  Logger.error(err?.stack || err?.message)

  if(res.headersSent) return

  res.statusCode = toNum(err.statusCode || status || 400)
  res.json(error)
}
