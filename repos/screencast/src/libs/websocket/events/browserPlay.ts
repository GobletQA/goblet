import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  TPlayerEvent,
  SocketManager,
  TPlayerTestEvent,
  TSocketEvtCBProps,
  TPlayerTestEventMeta
} from '@GSC/types'

import { emptyArr, isArr } from '@keg-hub/jsutils'
import { Repo } from '@gobletqa/shared/repo/repo'
import { playBrowser } from '@GSC/libs/playwright/browser/playBrowser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'


const handleStartPlaying = async (
  data:Record<any, any>,
  repo:Repo,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {

  const { action, browser } = data
  const browserConf = joinBrowserConf(browser, app)
  const player = await playBrowser({
    repo,
    action,
    browserConf,
    id: socket.id,
    onEvent:(event:TPlayerTestEventMeta) => {
      // Clean up the event data, we don't need the tests and describes content
      // And it can be pretty large. No point in sending it over the wire
      event.data = event.data || {} as TPlayerTestEvent
      if(isArr(event.data)) event.data = {} as TPlayerTestEvent
      if(event.data.tests) event.data.tests = emptyArr
      if(event.data.describes) event.data.describes = emptyArr

      console.log(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, { ...event, group: socket.id })
    },
    onCleanup: async (closeBrowser:boolean) => {
      socket?.id
        && Manager?.cache[socket.id]?.player
        && (Manager.cache[socket.id].player = undefined)
    }
  })

  Manager?.cache?.[socket.id]
    && (Manager.cache[socket.id].player = player)

}

export const browserPlay = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {

    const { repo } = await Repo.status(app.locals.config, { ...data.repo, ...user })
    await repo.refreshWorld()

    await handleStartPlaying(data, repo, socket, Manager, app)
  }
}
