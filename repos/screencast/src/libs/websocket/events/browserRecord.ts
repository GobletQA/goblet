import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { Repo, SocketManager, TSocketEvtCBProps } from '@GSC/types'

import { withRepo } from '@GSC/utils/withRepo'
import { recordBrowser } from '@gobletqa/browser'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'

type TRecordAction = {
  repo:Repo,
  app:Express
  socket:Socket
  data:Record<any, any>
  Manager:SocketManager
}

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
const handleStart = async (props:TRecordAction) => {
  const {
    app,
    data,
    repo,
    socket,
    Manager,
  } = props

  const {
    token,
    ref,
    action,
    ...browser
  } = data

  const browserConf = joinBrowserConf(browser, app)

  const recorder = await recordBrowser({
    repo,
    action,
    browserConf,
    id: socket.id,
    onRecordEvent:(event) => {
      console.log(`Emit ${event.name} event`, event)
      Manager.emit(socket, event.name, { ...event, group: socket.id })
    },
    onCleanup: async (browserClose:boolean) => {
      // TODO: Figure out what to do here
      // Now using the same browser instance, so we don't need to close it
    }
  })

  Manager.cache[socket.id].recorder = recorder
}


/**
 * Stops the browser recorder from recording actions
 * Pulls the Recorder instance from Socket Manager Cache
 * Then calls the recorders stop method
 *
 * @returns {void}
 */
const handleStop = async (props:TRecordAction) => {
  
  const {
    data,
    socket,
    Manager,
  } = props
  
  const { action=emptyObj } = data
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
export const browserRecord = (app:Express) => withRepo<TSocketEvtCBProps>(async (props) => {
    // TODO: add token validation
    const { action } = props?.data

    action.action === `start`
      ? await handleStart({ ...props, app })
      : await handleStop({ ...props, app })
  })


