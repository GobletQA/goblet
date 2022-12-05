import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { SocketManager, TSocketEvtCBProps } from '@GSC/types'

import { setPage } from '@GSC/libs/playwright'
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
    onEvent:(event) => {
      console.log(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, { ...event, group: socket.id })
    },
    onCleanup: async (closeBrowser:boolean) => {
      console.log(`------- run-tests clean-up -------`)
      // closeBrowser && await stopBrowser(browserConf)
    },
    onCreateNewPage: async (page:any) => {
      page && await setPage(page)
    },
  })

  Manager.cache[socket.id].player = player
}

export const browserRunTests = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {

    const { repo } = await Repo.status(app.locals.config, { ...data.repo, ...user })
    await repo.refreshWorld()

    await handleStartPlaying(data, repo, socket, Manager, app)
  }
}
