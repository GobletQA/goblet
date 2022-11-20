import type { Socket } from 'socket.io-client'
import type { TSockCmds, TSocketService, TSockCmd } from '@types'

import io from 'socket.io-client'

import * as EventTypes from '@constants/websocket'
import { AuthTokenHeader, TagPrefix } from '@constants/websocket'
import {
  getCommand,
  callAction,
  getTransports,
  buildEndpoint,
} from './helpers'
import {
  get,
  isObj,
  isFunc,
  noOpObj,
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
   * @public
   * @param {*} data - Items to be logged
   *
   * @returns {void}
   */
  logData(...data:any[]) {
    this.logDebug && console.log(...data)
  }

  /**
   * Helper to log events when logDebug is true
   * @memberof SocketService
   * @type function
   * @public
   * @param {string} event - Websocket event to be logged
   * @param {*} data - Items to be logged
   *
   * @returns {void}
   */
  logEvent(event:string, ...data:any[]) {
    this.logDebug && console.log(`Socket Event: ${event}`, ...data)
  }

  /**
   * Initializes the web-socket based on the passed in config
   * Starts initial handshake to connect with the backend
   * @memberof SocketService
   * @type function
   * @public
   *
   * @param {Object} config - Options for setting up the websocket
   * @param {string} token - Auth token for validating with the backend
   * @param {boolean} logDebug - Should log Socket events as the happen
   *
   * @returns {void}
   */
  initSocket(
    config:TSocketService,
    token?:string,
    logDebug = false
  ) {
    // If the sockets already setup, just return
    if (this.socket) return

    this.token = token
    this.config = config
    this.logDebug = logDebug

    const endpoint = buildEndpoint(config)

    this.logData(`Connecting to backend socket => ${endpoint}${config.path}`)

    const ioConfig = config.ioConfig || { extraHeaders: {} }

    // Setup the socket, and connect to the server
    this.socket = io(endpoint, {
      upgrade: true,
      path: config.path,
      ...(token && { auth: { token } }),
      ...ioConfig,
      transports: getTransports(ioConfig),
      extraHeaders: {
        ...(ioConfig.extraHeaders || {}),
        ...(token ? { [AuthTokenHeader]: token } : {}),
      },
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
   *
   * @param {Object} config - Options for setting up the websocket
   * @param {string} token - Auth token for validating with the backend
   * @param {boolean} logDebug - Should log Socket events as the happen
   *
   * @returns {void}
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
   * @public
   * @param {string} token - Auth token for validating with the backend
   * @param {Object} data - Content sent from the backend
   *
   * @returns {void}
   */
  onConnection(...args:string[]) {
    const [token, data] = args
    
    // TODO: Implement token auth
    // Send the token to the server to be validated
    // this.emit(EventTypes.WS_AUTH_TOKEN, { token: token })
    // Then call the `callAction` with the connected event args
    callAction(this, `${TagPrefix}:CONNECT`)?.(data, token)
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

    const toSend = isObj(data)
      ? { ...data, token: this.token }
      : { data, token: this.token }

    // Send a message to the server
    this.socket.emit(event, toSend)
  }

  /**
   * Builds the command to be run, and sends it to the backend
   * @memberof SocketService
   * @type function
   */
  runCommand(command:TSockCmd, params:Record<string, any>) {
    const foundCmd = getCommand(this.commands, command)
    if(!foundCmd) return this.logData(`Socket command not found for ${command}`)
    
    const { id, cmd, name, group } = foundCmd
    return this.emit(EventTypes.WS_RUN_CMD, {
      id,
      cmd,
      name,
      group,
      params,
      token: this.token,
    })
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
}

export const WSService = new SocketService()

