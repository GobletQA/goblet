#!/usr/bin/env node
import type { TBrowserProcs, TProc, TBrowserStatus, TBrowserConf } from '@GSC/types'

import '../../resolveRoot'
import { noOpObj } from '@keg-hub/jsutils'
import {
  statusServer,
  statusBrowser,
} from '@GSC/libs/playwright'
import {
  statusVNC,
  statusSockify,
} from '@GSC/libs/vnc'


export type TStatusScreencast = {
  vnc?: TProc
  sockify?: TProc
  server?: TBrowserProcs
  browser?: TBrowserStatus
  lastCheck?: number
}

export type TStatusSCParams = {
  browser?:TBrowserConf
}

/**
 * Gets the current status of the screencast processes
 */
export const statusScreencast = async (
  params:TStatusSCParams = noOpObj as TStatusSCParams
) => {

  const status = {} as TStatusScreencast
  status.vnc = await statusVNC()
  status.sockify = await statusSockify()
  status.server = await statusServer()

  if (params.browser){
    const { status:browserStatus } = await statusBrowser(params.browser)
    status.browser = browserStatus
  }

  return status
}
