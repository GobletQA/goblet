import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'
import { WS_PW_LOG } from '@gobletqa/shared/constants/websocket'

// TODO: move this to constants, and add more as needed
// Need to figure out how to fix these error at some point
const logFilter = [
  `Failed to adjust OOM score of renderer`,
]

export const connection = (app:Express) => {
  return ({ socket, Manager }:TSocketEvtCBProps) => {

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'goblet'

    // Setup tailLogger to log playwright output from debug log file
    const tailLogger = app?.locals?.tailLogger
    if(!tailLogger) return

    tailLogger.callbacks.onLine = (line:string) => {
      const shouldFilter = logFilter.find(filter => line.includes(filter))
      !shouldFilter && Manager.emit(socket, WS_PW_LOG, { message: line })
    }

    // Start listening to logs
    app.locals.tailLogger.start()
    
  }
}

