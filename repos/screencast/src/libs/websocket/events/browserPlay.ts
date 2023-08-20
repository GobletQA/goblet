import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TPlayerTestEvent,
  TSocketEvtCBProps,
  TPlayerTestEventMeta
} from '@GSC/types'

import { Repo } from '@gobletqa/workflows'
import { Logger } from '@GSC/utils/logger'
import { EAstObject } from '@ltipton/parkin'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { capitalize } from '@keg-hub/jsutils/capitalize'
import { PWEventErrorLogFilter, playBrowser } from '@gobletqa/browser'
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

  const lines = []
  const message = !evtData.failed || evtData.eventParent !== EAstObject.step
    ? ``
    : evtData?.failedExpectations?.reduce((message, exp:Record<any, any>) => {
        return exp?.description
          ? `${message}\n${exp?.fullName + `\n` || ``}${
              exp?.description?.split(`\n`)
                .map((line:string) => (
                  PWEventErrorLogFilter.filter(log => line.includes(log)).length ? `` : `  ${line}`
                ))
                .filter((line:string) => {
                  if(!line || !Boolean(line.trim())) return false
                  if(lines.includes(line.trim()))  return false
                  lines.push(line.trim())

                  return line
                })
                .join(`\n`)
            }`
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
    // TODO: update this to pass in step / shared options
    // Could also use as a way to pass callbacks as needed
    steps: {
      shared: {}
    },
    onEvent:(event:TPlayerTestEventMeta) => {

      const evtData = (event.data || {}) as TPlayerTestEvent
      const parent = getEventParent(evtData)

      // Get the event parent, and message if they exist
      if(parent) evtData.eventParent = parent
      if(evtData.eventParent) evtData.description = getEventMessage(evtData)

      // Clean up the event data, we don't need the tests and describes content
      // And it can be pretty large. No point in sending it over the wire
      if(evtData.tests) evtData.tests = emptyArr
      if(evtData.describes) evtData.describes = emptyArr

      Logger.verbose(`Emit ${event.name} event`, event)
      // Logger.verbose(`Emit ${event.name} event`)
      Manager.emit(socket, event.name, {
        ...event,
        data: evtData,
        group: socket.id
      })

    },
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

    const { repo } = await Repo.status(app.locals.config, { ...data.repo, ...user })
    await repo.refreshWorld()

    await handleStartPlaying(data, repo, socket, Manager, app)
  }
}

