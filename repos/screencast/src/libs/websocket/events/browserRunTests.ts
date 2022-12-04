import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { SocketManager, TSocketTokenData, TSocketEvtCBProps } from '@GSC/types'

import { Repo } from '@gobletqa/shared/repo/repo'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import {
  setPage,
  stopBrowser,
  startPlaying,
} from '@GSC/libs/playwright'

const handleStartPlaying = async (
  data:Record<any, any>,
  repo:Repo,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {
  const { token, ref, action, ...browser } = data
  const browserConf = joinBrowserConf(browser, app)
  const player = await startPlaying({
    repo,
    action,
    browserConf,
    id: socket.id,
    onPlayEvent:(event) => {
      console.log(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, { ...event, group: socket.id })
    },
    onCleanup: async closeBrowser => {
      closeBrowser && await stopBrowser(browserConf)
    },
    onCreateNewPage: async page => {
      page && await setPage(page)
    },
  })

  Manager.cache[socket.id].player = player
}

export const browserRunTests = (app:Express) => {
  return async ({data, socket, Manager }:TSocketEvtCBProps,) => {
    console.log(`------- browser run tests -------`)
    // const { iat, exp, ...user } = tokenData
    // const { repo } = await Repo.status(app.locals.config, { ...data.repo, ...user })
    // await repo.refreshWorld()
    
    // console.log(`------- repo -------`)
    // console.log(repo)


    // await handleStartPlaying(data, repo, socket, Manager, app)
  }
}
