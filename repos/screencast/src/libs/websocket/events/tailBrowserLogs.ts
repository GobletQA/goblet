import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { WS_PW_LOG } from '@gobletqa/shared/constants/websocket'
import { PWLogFilter } from '@gobletqa/shared/constants/playwright'


export const tailBrowserLogs = (app:Express, { socket, Manager }:TSocketEvtCBProps) => {

  // Setup tailLogger to log playwright output from debug log file
  const tailLogger = app?.locals?.tailLogger
  if(!tailLogger) return

  tailLogger.callbacks.onLine = (line:string) => {
    const shouldFilter = PWLogFilter.find(filter => line.includes(filter))
    !shouldFilter && Manager.emit(socket, WS_PW_LOG, { message: line })
  }

  // Start listening to logs
  app.locals.tailLogger.start()
}
