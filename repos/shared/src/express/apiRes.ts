import { toNum, noOpObj } from '@keg-hub/jsutils'
import type { Response } from 'express'

/**
 * Api response helper called by all json api endpoints
 * Ensures the status code is set
 * Ensures consistent response object is returned
 *
 */
export const apiRes = (res:Response, data?:Record<any, any>, status?:number) => {
  res.statusCode = toNum(status || 200)

  return res.json(data || noOpObj)
}
