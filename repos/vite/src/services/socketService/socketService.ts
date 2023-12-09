import type { Socket } from 'socket.io-client'
import type { TRepoApiObj, TSockCmds, TSocketEmitData, TSocketService } from '@types'

import io from 'socket.io-client'
import { events } from './events'
import { EAppStatus } from '@types'
import { WSSocketResetEvt } from '@constants'
import { TagPrefix } from '@constants/websocket'

import { EE } from '@services/sharedService'
import * as WSEventTypes from '@constants/websocket'
import {
  callAction,
  getTransports,
  buildEndpoint,
} from './helpers'
import {
  get,
  isObj,
  isFunc,
  noOpObj,
  deepMerge,
  snakeCase,
} from '@keg-hub/jsutils'
import { repoApiObj } from '@utils/repo/repoApiObj'
import {getAppData} from '@utils/store/getStoreData'
import {signOutManually} from '@actions/admin/user/signOutManually'

const {
  WSPwConsole,
  WSIdleStatus,
  WSPwUrlChange,
  WSReconnectAttempts,
  WSReconnectInterval,
  WSPwBrowserRestarted,
  ...EventTypes
} = WSEventTypes


/**
 * Service class for managing client websocket events
 * @function
 * @private
 *
 * @param {Object} config - Websocket client config object matching the config spec
 * @param {string} token - Auth token for connecting to the websocket
 *
 * @returns {Object} - Instance of SocketService
 */
export class SocketService {

  io = io
  token?:string
  logDebug:boolean=false
  socket:Socket|null=null
  commands:TSockCmds=noOpObj as TSockCmds
  config:TSocketService=noOpObj as TSocketService

  /**
   * Helper to log data when logDebug is true
   * @memberof SocketService
   * @type function
   */
  logData(...data:any[]) {
    this.logDebug && console.log(...data)
  }

  /**
   * Helper to log events when logDebug is true
   * @memberof SocketService
   * @type function
   * @public
   */
  logEvent(event:string, ...data:any[]) {
    this.logDebug && console.log(`Socket Event: ${event}`, ...data)
  }

  /**
   * Initializes the web-socket based on the passed in config
   * Starts initial handshake to connect with the backend
   */
  initSocket(
    config:TSocketService,
    token?:string,
    logDebug:boolean = false
  ) {
    // If the sockets already setup, just return
    if (this.socket) return

    this.token = token
    this.logDebug = logDebug
    this.config = deepMerge({ events }, config)

    const endpoint = buildEndpoint(config)

    this.logData(`Connecting to backend socket => ${endpoint}${config.path}`)

    // Setup the socket, and connect to the server
    this.socket = io(endpoint, {
      ...(token && { auth: { token } }),
      upgrade: true,
      path: this.config.path,
      query: this.config.query || noOpObj,
      transports: getTransports(this.config),
      reconnectionAttempts: WSReconnectAttempts,
      reconnectionDelay: WSReconnectInterval * 1000,
      extraHeaders: this.config.extraHeaders || noOpObj,
    })

    this.addEvents()

    return this
  }

  /**
   * Initializes the web-socket based on the passed in config
   * Starts initial handshake to connect with the backend
   * @memberof SocketService
   * @type Object
   * @public
   */
  addEvents() {
    if (!this.socket) return

    // Map the custom config.events with valid actions
    // To listeners on the websocket
    // Skip if an event type matching an internal event
    // Custom event types with the same name as internal event
    // Get called within the callAction of the registered internal event
    Object.entries(this?.config?.events || noOpObj).map(
      ([ name, action ]) => {
        
        const namCaps = snakeCase(name).toUpperCase()
        if (namCaps === `ALL`) return

        const eventType = `${TagPrefix}:${namCaps}`

        isFunc(action) &&
          !EventTypes[namCaps as keyof typeof EventTypes] &&
          this?.socket?.on(eventType, callAction(this, eventType))
      }
    )

    // Socket Map Event types to internal actions
    Object.entries(EventTypes as Record<string, string>)
      .map(([key, eventType]) => this?.socket?.on(eventType, callAction(this, eventType)))

    // Initial connection to the server through the socket
    // Call the onConnection method which will handel authorization
    this.socket.on(`connect`, this.onConnection.bind(this))
    this.socket.on(
      `connect_failed`,
      this.onError.bind(this, `connect_failed`)
    )
    this.socket.io.on(
      `error`,
      this.onError.bind(this, `error`)
    )
    this.socket.io.on(
      `reconnect_error`,
      this.onError.bind(this, `reconnect_error`)
    )
    this.socket.io.on(
      `reconnect_failed`,
      this.onReconnectFailed.bind(this)
    )
  }

  onReconnectFailed(){
    const { status } = getAppData()

    // If we failed to reconnect and in idle status
    // Then just log out, because we can't do anything anyways
    status === EAppStatus.Idle
      ? signOutManually()
      : EE.emit(WSSocketResetEvt, {})
  }

  // TODO: handle errors and reconnect errors for main web-socket
  // When the user is idle, or the container is killed,
  // Need to stop calling backend api web-socket 
  onError(type:string, err:any) {
    // console.log(`------- err -------`)
    // console.log(type, [err])
  }

  /**
   * Callback method called when the websocket connects to the backend
   * @memberof SocketService
   * @type function
   */
  onConnection(...args:string[]) {
    const [data] = args
    callAction(this, `${TagPrefix}:CONNECT`)?.(data)
  }

  /**
   * Sends an event to the connected backend through websocket ( Like an REST API call )
   * @memberof SocketService
   */
  emit = (event:string, data:TSocketEmitData={}) => {

    if (!this.socket)
      return console.error(`Socket not connected, cannot emit socket event!`)

    if (!event)
      return console.error(
        `Event type is missing, cannot emit socket event without an event type!`,
        event
      )

    this.logData(`Sending Socket Event: ${event}`, data)

    const toSend = isObj(data)
      ? { ...data, repo: repoApiObj(data.repo as TRepoApiObj) }
      : { data, repo: repoApiObj() }

    // Send a message to the server
    this.socket.emit(event, toSend)
  }

  /**
   * Disconnects from the backend websocket
   * Cleans up any open object || handles
   * @memberof SocketService
   * @type function
   */
  disconnect = () => {
    if (!this.socket) return this.logData(`Socket already disconnected!`)

    this.logData(`Disconnecting from Socket!`)
    try {
      this.socket?.removeAllListeners?.()
      this.socket?.disconnect?.()
    }
    catch(err){
      if(!this.socket.disconnected){
        console.log(`Error disconnecting from web-socket`)
        console.log(err)
      }
    }

    this.socket = null
    this.config = noOpObj as TSocketService
  }


  runCommand(...args:any[]) {
    console.error(`Don't Use this any more`)
  }

}

export const WSService = new SocketService()

