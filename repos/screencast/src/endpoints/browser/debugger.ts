import type { Response, Request } from 'express'
import type { TBrowserDebuggerCfg } from '@gobletqa/shared/types'

import { ENVS } from '@gobletqa/environment'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import { apiRes, AppRouter } from '@gobletqa/shared/api'



export type TDebuggerParams = {
  url?:string
}

/**
 * Endpoint to get the current status  of the browser
 */
export const scDebugger = async (req:Request, res:Response) => {
  const url = req?.query?.url

  const response = await fetch(`http://localhost:${ENVS.GB_DT_REMOTE_DEBUG_PORT}/json`)
  const configs = await response.json() as TBrowserDebuggerCfg[]
  const debuggers = ensureArr(configs)
  const found = url && debuggers.find(cfg => cfg.url === url) || debuggers[0]

  return apiRes(res, found, 200)
}

AppRouter.get(`/screencast/browser/debugger`, scDebugger)
