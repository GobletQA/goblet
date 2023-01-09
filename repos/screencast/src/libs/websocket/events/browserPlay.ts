import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { SocketManager, TSocketEvtCBProps, TPlayerEvent, TPlayerTestSuiteFinished } from '@GSC/types'

import { exists } from '@keg-hub/jsutils'
import { EPlayerTestType } from '@GSC/types'
import { Repo } from '@gobletqa/shared/repo/repo'
import { PlaySuiteDone, PlayResults } from '@GSC/constants'
import { playBrowser } from '@GSC/libs/playwright/browser/playBrowser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

const skipEvents = [
  PlayResults,
]

const shouldSkipEvt = (event:TPlayerEvent) => {
  let shouldSkip = skipEvents.includes(event.name)
  return shouldSkip || Boolean(
    event.name === PlaySuiteDone
      && event?.data?.type === EPlayerTestType.describe
      && exists((event?.data as TPlayerTestSuiteFinished)?.describes)
  )
}

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
    onEvent:(event:TPlayerEvent) => {
      if(shouldSkipEvt(event)) return

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
