import type { Response } from 'express'
import { toNum, emptyObj } from '@keg-hub/jsutils'

/**
 * Api response helper called by all json api endpoints
 * Ensures the status code is set
 * Ensures consistent response object is returned
 *
 */
export const apiRes = <Data extends Record<any, any>>(
  res:Response<Data>,
  data?:Data,
  status?:number
) => {
  res.statusCode = toNum(status || 200)

  return res.json(data || emptyObj as Data)
}
