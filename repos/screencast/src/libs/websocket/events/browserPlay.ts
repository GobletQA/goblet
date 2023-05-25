import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TPlayerTestEvent,
  TSocketEvtCBProps,
  TPlayerTestEventMeta
} from '@GSC/types'

import { Logger } from '@GSC/utils/logger'
import { EAstObject } from '@ltipton/parkin'
import { Repo } from '@gobletqa/shared/repo/repo'
import { PWEventErrorLogFilter } from '@GSC/constants'
import { capitalize, emptyArr, isArr } from '@keg-hub/jsutils'
import { playBrowser } from '@GSC/libs/playwright/browser/playBrowser'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'

const getEventParent = (evtData:TPlayerTestEvent) => {
  if(!evtData?.id) return

  const [name, ...rest] = evtData?.id?.split(`-`)
  return name.startsWith(`spec`)
    ? EAstObject.step
    : rest.length > 1 ? EAstObject.scenario : EAstObject.feature
}

const getEventMessage = (evtData:TPlayerTestEvent) => {
  const status = evtData.action === `start`
    ? `running`
    : evtData.passed ? `passed` : `failed`

  const message = !evtData.failed || evtData.eventParent !== EAstObject.step
    ? ``
    : evtData?.failedExpectations?.reduce((message, exp:Record<any, any>) => {
        return exp?.message
          ? `${message}\n${exp?.message?.split(`\n`).map((line:string) => {
            return PWEventErrorLogFilter.filter(log => line.includes(log)).length ? `` : `  ${line}`
          }).filter(Boolean).join(`\n`)}`
          : message
      }, `\n`) || ``

  return `${capitalize(evtData.eventParent)} - ${status}${message}`
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
    onEvent:(event:TPlayerTestEventMeta) => {

      const evtData = (event.data || {}) as TPlayerTestEvent
      const parent = getEventParent(evtData)

      // Get the event parent, and message if they exist
      if(parent) evtData.eventParent = parent
      if(evtData.eventParent) evtData.message = getEventMessage(evtData)

      // Clean up the event data, we don't need the tests and describes content
      // And it can be pretty large. No point in sending it over the wire
      if(evtData.tests) evtData.tests = emptyArr
      if(evtData.describes) evtData.describes = emptyArr

      Logger.verbose(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, {
        ...event,
        data: evtData,
        group: socket.id
      })

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

