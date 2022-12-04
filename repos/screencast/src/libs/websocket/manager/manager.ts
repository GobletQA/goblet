import type { Server, Socket } from 'socket.io'
import type {
  TSocketMessage,
  TSocketMessageObj,
} from '@GSC/types'

import * as WSConstants from '@gobletqa/shared/constants/websocket'
import {
  TagPrefix,
  WS_INIT,
  WS_ADD_PEER,
  WS_NOT_AUTHORIZED,
  WS_PEER_DISCONNECT,
} from '@gobletqa/shared/constants/websocket'


import {
  get,
  isFunc,
  isObj,
  isStr,
  uuid,
  noOpObj,
  snakeCase,
  deepMerge,
} from '@keg-hub/jsutils'

const EventTypeValues = Object.values(WSConstants)

/**
 * Gets the current time, used for a timestamp
 * @function
 * @private
 */
const getTimeStamp = () => new Date().getTime()

/**
 * Helper to log errors when they are thrown
 * @function
 * @private
 */
const logError = (err:Error = noOpObj as Error, method:string) => {
  console.log(`[ Socket Error ] --- SocketManager.${method}`)
  err.stack && console.error(err.stack)
}

/**
 * Class for managing socket.io sockets
 * Keeps track of connected sockets and currently running command process
 * Handles broadcasting / emitting events
 * @class
 */
export class SocketManager {
  socketIo:Server
  isRunning:boolean
  cache:Record<any, any>={}
  peers:Record<any, any>={}

  constructor(opts = {}) {
    this.isRunning = false
  }

  /**
   * Add tag formatting for custom events
   */
  formatTag = (tag:string) => {
    if (EventTypeValues.includes(tag)) return tag

    const trimmed = tag.trim()
    const [ ___, ...split ] = trimmed.startsWith(`${TagPrefix}:`)
      ? trimmed.split(':')
      : [ null, trimmed ]

    return `${TagPrefix}:${snakeCase(
      split.join(':').replace(/:\s/g, '_')
    ).toUpperCase()}`
  }

  /**
   * Helper to build the message model object
   * @function
   * @private
   */
  buildMessage = (
    message:Partial<TSocketMessage> = noOpObj,
    socket?:Socket
  ) => {
    // Ensure the message is an object
    const messageObj = isObj(message) ? { ...message } : { message }
    // If a socket is passed, add the socket Id and socket group Id
    if (socket) {
      messageObj.socketId = socket.id
      messageObj.groupId = get(this.cache, [ socket.id, `groupId` ])
    }

    return deepMerge<TSocketMessage>(
      {
        id: uuid(),
        message: '',
        error: false,
        data: noOpObj,
        group: 'all',
        name: 'general',
        isRunning: this.isRunning,
        timestamp: getTimeStamp(),
      },
      messageObj
    )
  }

  /**
   * Adds a socket to the peers list
   * Sets up the on-disconnect callback, called when a socket disconnects
   * @memberof SocketManager
   * @alias instance&period;add
   * @function
   * @public
   */
  add = (socket:Socket) => {
    this.peers[socket.id] = socket
    this.cache[socket.id] = {}

    return socket.id
  }

  /**
   * Gets the socket id based on the passed in id or socket object
   * @memberof SocketManager
   * @alias instance&period;getId
   * @function
   * @public
   *
   * @returns {string} Id the the added socket
   */
  getId = (sockOrId:Socket|string) => isStr(sockOrId) ? sockOrId : sockOrId.id

  /**
   * Gets the socket object based on the passed in id
   * @memberof SocketManager
   * @alias instance&period;getSocket
   * @function
   * @public
   */
  getSocket = (id:string) => this.peers[id]

  /**
   * Converts the passed in data object into a string
   * @memberof SocketManager
   * @alias instance&period;toJsonStr
   * @function
   * @public
   */
  toJsonStr = (data:any) => {
    try {
      return JSON.stringify((!isObj(data) && { data }) || data)
    }
    catch (err) {
      logError(err, 'toJsonStr')
      return JSON.stringify({ error: 'Error in SocketManager.toJsonStr' })
    }
  }

  /**
   * Calls the passed in sockets emit method.
   * Passes tag and string formatted data object as arguments
   * @memberof SocketManager
   * @alias instance&period;emit
   * @function
   * @public
   */
  emit = (
    _socket:Socket|string,
    tag:string,
    data:Record<any, any>
  ) => {
    try {
      const socket:Socket = isStr(_socket) ? this.getSocket(_socket) : _socket

      if (!socket || !isFunc(socket.emit))
        return console.error(
          `A Socket with an emit method is required to emit events!`
        )

      const toSend:Partial<TSocketMessageObj> = isObj(data) ? data : { data }
      toSend.socketId = socket.id
      toSend.groupId = get(this.cache, [ socket.id, `groupId` ])

      socket.emit(
        this.formatTag(tag),
        this.toJsonStr(this.buildMessage(toSend, socket))
      )
    }
    catch (err) {
      logError(err, 'emit')
    }
  }

  /**
   * Broadcasts a message to all connected sockets other then the passed in socket
   * Passes tag and string formatted data object as arguments
   * @memberof SocketManager
   * @alias instance&period;broadCastAll
   * @function
   * @public
   */
  broadCastAll = (
    _socket:Socket|string,
    tag:string,
    data:Record<any, any>
  ) => {
    try {
      
      const socket:Socket = isStr(_socket) ? this.getSocket(_socket) : _socket

      socket &&
        socket.broadcast &&
        isFunc(socket.broadcast.emit) &&
        socket.broadcast.emit(
          this.formatTag(tag),
          this.toJsonStr(this.buildMessage(data, socket))
        )
    }
    catch (err) {
      logError(err, 'broadCastAll')
    }
  }

  /**
   * Emits a message to all socketsIo sockets
   * Passes tag and string formatted data object as arguments
   * @memberof SocketManager
   * @alias instance&period;broadCastAll
   * @function
   * @public
   */
  emitAll = (
    tag:string,
    data:Record<any, any>
  ) => {

    try {
      if (!this.socketIo)
        return console.error(`Socket.IO is not set on SocketManager!`)

      if (!tag)
        return console.error(`SocketManager.emitAll requires an event tag as param 2!`)

      if(!data.socketId)
        return console.error(`SocketManager.emitAll - Missing data.socketId`)

      const socket:Socket = this.getSocket(data.socketId)
      const groupId = get(this.cache, [ data.socketId, `groupId` ])

      // TODO: Update to emit only to group room when group Id exists
      this.socketIo.emit(
        this.formatTag(tag),
        this.toJsonStr(this.buildMessage({ ...data, groupId }, socket))
      )
    }
    catch (err) {
      logError(err, 'emitAll')
    }
  }

  /**
   * Sets up a connected socket, and emits the init event
   * Sends the sockets id and initial content
   * Broadcasts to all connected sockets that a new socket has connected
   * @memberof SocketManager
   * @alias instance&period;setupSocket
   * @function
   * @public
   */
  setupSocket = (socket:Socket) => {
    try {
      const id = this.add(socket)
      if (!id) return console.error(`setupSocket - Could not add socket. No id returned.`, socket, id)

      this.emit(socket, WS_INIT, {
        id,
        message: `Server socket initialized!`,
        data: { peers: Object.keys(this.peers) },
      })

      this.broadCastAll(socket, WS_ADD_PEER, {
        id: socket.id,
        data: { peers: Object.keys(this.peers) },
      })
    }
    catch (err) {
      logError(err, 'setupSocket')
    }
  }

  /**
   * Force disconnects a socket when it's not authorized
   * @memberof SocketManager
   * @alias instance&period;disconnect
   * @function
   * @public
   */
  disconnect = (
    _socket:Socket|string,
    message:TSocketMessageObj,
    tag:string=WS_NOT_AUTHORIZED
  ) => {

    // Ensure we have the socket object and not the id
    const socket:Socket = isStr(_socket) ? this.getSocket(_socket) : _socket
    

    // If no socket can be found, then just return
    if (!socket) return

    // Update the client with the NOT_AUTHORIZED event
    this.emit(socket, tag, { message: message || `Missing authorization. Please login!`, })

    // Clear any cache data if needed
    delete this.cache[socket.id]

    // Wait a little bit tl allow the NOT_AUTHORIZED event to be sent,
    setTimeout(() => socket.disconnect(), 100)
  }

  /**
   * Handles when a socket disconnects from the server
   * Broadcasts to all connected sockets that a socket has disconnected
   * Ensures the socket is removed from the peers list
   * @memberof SocketManager
   * @alias instance&period;onDisconnect
   * @function
   * @public
   */
  onDisconnect = (_socket:Socket|string) => {

    // Ensure we have the socket object and not the id
    const socket:Socket = isStr(_socket) ? this.getSocket(_socket) : _socket

    try {
      // Clear any cache data if needed
      delete this.cache[socket.id]

      if (!this.peers[socket.id]) return

      delete this.peers[socket.id]

      this.emitAll(WS_PEER_DISCONNECT, {
        socketId: socket.id,
        data: { peers: Object.keys(this.peers) },
      })
    }
    catch (err) {
      logError(err, 'onDisconnect')
      if (isObj(this.peers)) delete this.peers[socket.id]
    }
  }
}



