import type { Express } from 'express'
import type {
  TSocketEvtCBProps,
  TPlayerTestEventMeta
} from '@GSC/types'

import { Logger } from '@GSC/utils/logger'
import { withRepo } from '@GSC/utils/withRepo'
import { getDefinitions } from '@gobletqa/repo'
import { playBrowser, WSPwConsole } from '@gobletqa/browser'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import { formatTestEvt } from '@GSC/libs/websocket/utils/formatTestEvt'


export const browserPlay = (app:Express) => withRepo<TSocketEvtCBProps>(async ({
  repo,
  data,
  socket,
  Manager,
}) => {

  const { action, browser, forwardLogs } = data
  const browserConf = joinBrowserConf(browser, app)
  await getDefinitions(repo, false)

  const player = await playBrowser({
    repo,
    action,
    forwardLogs,
    browserConf,
    id: socket.id,
    // TODO: update this to pass in step / shared options
    // Could also use as a way to pass callbacks as needed
    steps: {
      shared: {}
    },
    onConsole: (message) => {
      Manager.emit(socket, WSPwConsole, {data: {
        type: message.type,
        text: message.text,
        location: message.location,
      }})
    },
    onEvent:(event:TPlayerTestEventMeta) => {
      const emitEvt = formatTestEvt(event, { group: socket.id })
      Logger.verbose(`Emit ${event.name} event`)
      Manager.emit(socket, event.name, emitEvt)
    },
    /**
    * onCleanup callback event is always called after the Player stops playing
    * Both when finished or if playing is canceled
    */
    onCleanup: async (browserClose:boolean) => {
      socket?.id
        && Manager?.cache[socket.id]?.player
        && (Manager.cache[socket.id].player = undefined)
    }
  })

  Manager?.cache?.[socket.id]
    && (Manager.cache[socket.id].player = player)
  
})


