import type { TRouteMeta, TProxyRoute, TContainerMeta } from '@types'

import { GB_SC_PORT } from '@constants'
import { containerDispatch } from '@store'
import { noOpObj, toStr } from '@keg-hub/jsutils'
import { localStorage } from '@services/localStorage'

type SplitRoutes = {
  api: TProxyRoute
  screencast: TProxyRoute
}

/**
 * Helper to throw an error if the routes are not configured properly
 */
const throwRoutesError = (status:TRouteMeta, type:string, error?:string) => {
  type
    ? console.error(`Could not set ${type}, it does not exist on the routes object`)
    : error && console.error(error)

  console.log(`Routes:`, status)
  throw new Error(`Error setting container routes`)
}

export const setContainerRoutes = async (status:TRouteMeta) => {
  const { error, routes=noOpObj, meta=noOpObj as TContainerMeta } = status

  if(error) return throwRoutesError(status, ``, error)
  if(!routes) return throwRoutesError(status, `session container routes`)

  const { api, screencast } = Object.entries(routes)
    .reduce((acc, [port, data]) => {
      toStr(port) === toStr(GB_SC_PORT)
        ? (acc.api = data)
        : (acc.screencast = data)

      return acc
    }, {} as SplitRoutes)

  !api?.headers
    ? throwRoutesError(status, `api route headers`)
    : await localStorage.setHeaders(api?.headers)

  containerDispatch.setContainer({
    api,
    meta,
    screencast,
  })
  
  return routes
}