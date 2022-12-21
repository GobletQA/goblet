import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { SocketManager, TSocketEvtCBProps } from '@GSC/types'

import { noOpObj } from '@keg-hub/jsutils'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { recordBrowser } from '@GSC/libs/playwright/browser/recordBrowser'

/**
 * Stats a the browser recorder from a socket.io event
 * Stores the recorder in the websocket Manager cache
 * Adds hook to emit an event when a recorder event fires
 * Adds hook to stop the browser when the recorders onCleanup event is fired
 *
 * @param {Object} data - Data object passed to the socket event from the FE
 * @param {Object} socket - Socket.io Socket object
 * @param {Object} Manager - Socket Manager instance
 * @param {Object} app - Express app instance
 *
 * @returns {void}
 */
const handleStart = async (
  data:Record<any, any>,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {
  const { token, ref, action, repo, ...browser } = data
  const browserConf = joinBrowserConf(browser, app)

  const recorder = await recordBrowser({
    action,
    browserConf,
    id: socket.id,
    onRecordEvent:(event) => {
      console.log(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, { ...event, group: socket.id })
    },
    onCleanup: async closeBrowser => {
      // TODO: Figure out what to do here
      // Now using the same browser instance, so we don't need to close it
    },
    onCreateNewPage: async page => {
      // TODO: Figure out what to do here
      // For now, limiting the amount of pages to 1
    },
  })

  Manager.cache[socket.id].recorder = recorder
}


/**
 * Stops the browser recorder from recording actions
 * Pulls the Recorder instance from Socket Manager Cache
 * Then calls the recorders stop method
 *
 * @param {Object} data - Data object passed to the socket event from the FE
 * @param {Object} socket - Socket.io Socket object
 * @param {Object} Manager - Socket Manager instance
 *
 * @returns {void}
 */
const handleStop = async (
  data:Record<any, any>,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {
  const { action=noOpObj } = data
  const cache = Manager.cache[socket.id]

  // TODO: handle socket.io error - missing cache to stop recorder
  if(!cache || !cache.recorder)
    return console.log(`Missing socket cache or recorder`, cache)

  await cache.recorder.stop(...action.props)
  delete cache.recorder

}

/**
 * Handler for registering Browser Recorder start and stop events
 * @function
 * @param {Object} app - Express App object
 *
 * @returns {function} - Custom Event Method passed to Socket to be called from the frontend
 */
export const browserRecord = (app:Express) => {
  return async ({ data, socket, Manager }:TSocketEvtCBProps) => {
    // TODO: add token validation
    const { action } = data

    action.action === 'start'
      ? await handleStart(data, socket, Manager, app)
      : await handleStop(data, socket, Manager, app)
  }
}

