import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { PWLogFilter } from '@GSC/constants'
import { WS_PW_LOG } from '@gobletqa/shared/constants/websocket'

export const connection = (app:Express) => {
  return ({ socket, Manager }:TSocketEvtCBProps) => {

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'goblet'

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
}

