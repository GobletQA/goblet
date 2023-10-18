import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TSocketEvtCBProps,
  TPlayerTestEventMeta
} from '@GSC/types'


import { Logger } from '@GSC/utils/logger'
import { playBrowser } from '@gobletqa/browser'
import { getDefinitions, Repo } from '@gobletqa/repo'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'
import { formatTestEvt } from '@GSC/libs/websocket/utils/formatTestEvt'

const handleStartPlaying = async (
  data:Record<any, any>,
  repo:Repo,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {

  const { action, browser } = data
  const browserConf = joinBrowserConf(browser, app)
  await getDefinitions(repo, false)

  const player = await playBrowser({
    repo,
    action,
    browserConf,
    id: socket.id,
    // TODO: update this to pass in step / shared options
    // Could also use as a way to pass callbacks as needed
    steps: {
      shared: {}
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

}

export const browserPlay = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {
    const { repo } = await loadRepoFromSocket({
      user,
      repo: data?.repo,
    })

    await handleStartPlaying(data, repo, socket, Manager, app)
  }
}

