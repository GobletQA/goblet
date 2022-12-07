import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'
import type { Frame } from 'playwright'

import { EBrowserEvent } from '@GSC/types'
import { PWLogFilter, WS_PW_URL_CHANGE } from '@GSC/constants'
import { WS_PW_LOG } from '@gobletqa/shared/constants/websocket'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { browserEvents } from '@GSC/libs/playwright/browser/browserEvents'

const startLogTail = (app:Express, { socket, Manager }:TSocketEvtCBProps) => {
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

const watchBrowser = (app:Express, { socket, Manager }:TSocketEvtCBProps) => {
  const browserConf = joinBrowserConf({}, app)
  browserEvents({
    browserConf,
    events: {
      [EBrowserEvent.framenavigated]: [
        (frame:Frame) => {
          if(frame.parentFrame()) return
          const url = frame.url()
          Manager.emit(socket, WS_PW_URL_CHANGE, {data: { url }, group: socket.id })
        }
      ]
      // TODO: Add a Page.on close listener, and auto recreate the page
    },
  })
}

export const connection = (app:Express) => {
  return (props:TSocketEvtCBProps) => {
    const { socket, Manager } = props

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'goblet'

    startLogTail(app, props)
    watchBrowser(app, props)
  }
}

