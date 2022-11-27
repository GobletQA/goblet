import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { TSocketEvtCBProps } from '@GSC/types'


export const connection = (app:Express) => {
  return ({ socket, Manager }:TSocketEvtCBProps) => {

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'goblet'

    // Setup tailLogger to log playwright output from debug log file
    const tailLogger = app?.locals?.tailLogger
    if(!tailLogger) return

    tailLogger.callbacks.onLine = (line:string) => {
      Manager.emitAll(socket, {
        message: line,
        group: 'goblet',
        name: 'playwright',
      })
    }
  }
}

