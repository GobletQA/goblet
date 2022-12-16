import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'
import type { Frame } from 'playwright'

import { EBrowserEvent } from '@GSC/types'
import { WS_PW_URL_CHANGE } from '@GSC/constants'
import { tailBrowserLogs } from './tailBrowserLogs'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { browserEvents } from '@GSC/libs/playwright/browser/browserEvents'

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
    },
  })
}

export const connection = (app:Express) => {
  return (props:TSocketEvtCBProps) => {
    const { socket, Manager } = props

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'goblet'

    tailBrowserLogs(app, props)
    watchBrowser(app, props)
  }
}

