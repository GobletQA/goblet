import type { Socket } from 'socket.io-client'
import type { TSockCmds, TSocketService } from '@types'

import io from 'socket.io-client'
import { events } from './events'
import { TagPrefix } from '@constants'
import * as EventTypes from '@constants/websocket'
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
    Object.entries(get(this.config, 'events', noOpObj)).map(
      ([ name, action ]) => {
        
        const namCaps = snakeCase(name).toUpperCase()
        if (namCaps === 'ALL') return

        const eventType = `${TagPrefix}:${namCaps}`

        isFunc(action) &&
          !EventTypes[namCaps as keyof typeof EventTypes] &&
          this?.socket?.on(eventType, callAction(this, eventType))
      }
    )

    // Socket Map Event types to internal actions
    Object.entries(EventTypes).map(([ key, eventType ]) => {
      this?.socket?.on(eventType, callAction(this, eventType))
    })

    // Initial connection to the server through the socket
    // Call the onConnection method which will handel authorization
    this.socket.on(`connect`, this.onConnection.bind(this))
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
  emit = (event:string, data:Record<any, any>) => {
    if (!this.socket)
      return console.error(`Socket not connected, cannot emit socket event!`)

    if (!event)
      return console.error(
        `Event type is missing, cannot emit socket event without an event type!`,
        event
      )

    this.logData(`Sending Socket Event: ${event}`, data)

    const toSend = isObj(data) ? data : { data }

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
    this.socket.disconnect()
    this.socket = null
    this.config = noOpObj as TSocketService
  }


  runCommand(...args:any[]) {
    console.error(`Don't Use this any more`)
  }

}

export const WSService = new SocketService()

