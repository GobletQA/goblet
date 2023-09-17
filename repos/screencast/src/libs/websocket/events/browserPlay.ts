import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  TExEventData,
  SocketManager,
  TPlayerTestEvent,
  TSocketEvtCBProps,
  TPlayerTestEventMeta
} from '@GSC/types'


import { PWPlay } from '@GSC/constants'
import { Logger } from '@GSC/utils/logger'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { getDefinitions, Repo } from '@gobletqa/repo'
import { capitalize } from '@keg-hub/jsutils/capitalize'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'
import { PWEventErrorLogFilter, playBrowser } from '@gobletqa/browser'

// Temporary until updates to use only exam for test execution
import { filterErrMessage } from '../../../../../exam/src/utils/filterErrMessage'

const getEventParent = (evtData:TPlayerTestEvent) => {
  if(!evtData?.id) return

  const [name, ...rest] = evtData?.id?.split(`-`)
  return name.startsWith(`spec`)
    ? `step`
    : rest.length > 1 ? `scenario` : `feature`
}

const getEventMessage = (evtData:TPlayerTestEvent) => {
  const status = evtData.action === `start`
    ? `running`
    : evtData.passed ? `passed` : `failed`

  const lines = []
  const message = !evtData.failed || evtData.eventParent !== `step`
    ? ``
    : filterErrMessage(evtData as TExEventData, PWEventErrorLogFilter)

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

      const evtData = (event.data || {}) as TPlayerTestEvent
      const parent = getEventParent(evtData)

      // Get the event parent, and message if they exist
      if(parent) evtData.eventParent = parent as any

      if(evtData.eventParent) evtData.description = getEventMessage(evtData)

      // Clean up the event data, we don't need the tests and describes content
      // And it can be pretty large. No point in sending it over the wire
      if(evtData.tests) evtData.tests = emptyArr
      if(evtData.describes) evtData.describes = emptyArr
      if(evtData.failedExpectations) delete evtData.failedExpectations

      if(event.name === PWPlay.playError && event.message)
        event.message = filterErrMessage(evtData as TExEventData, PWEventErrorLogFilter)

      const emitEvt = {...event, data: evtData, group: socket.id}

      Logger.verbose(`Emit ${event.name} event`, emitEvt)
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

