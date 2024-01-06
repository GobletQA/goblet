import type http from 'http'
import type https from 'https'
import type {
  TSocketConfig,
  TSocketConfigOpts,
  TSocketEvtCBProps,
} from '@GSC/types'

import { deepMerge } from '@keg-hub/jsutils/deepMerge'

import { Server } from 'socket.io'
import { Logger } from '@GSC/utils/logger'
import { get } from '@keg-hub/jsutils/get'
import { setupEvents } from './setupEvents'
import { validateToken } from './validateToken'
import { SocketManager } from '../manager/manager'
import { checkCall } from '@keg-hub/jsutils/checkCall'

export type TSocketInit = {
  io:Server
  config:TSocketConfig
  Manager:SocketManager
}


const buildConfig = async (serverConfig:TSocketConfig) =>{
  const {
    host,
    port,
    path: socketPath,
    ...config
  } = deepMerge<TSocketConfigOpts>(
    Boolean(!serverConfig) && { process: {} },
    serverConfig
  )

  return {
    ...config,
    socket: {
      port,
      host,
      path: socketPath,
    },
  } as TSocketConfig
}


const setupManager = (
  io:Server
) => {
  // Setup the Socket Manager
  const Manager = new SocketManager()
  // Ensure we have access to the SocketIO class
  Manager.socketIo = Manager.socketIo || io
  return Manager
}

export const onConnect = (
  config:TSocketConfig,
  io:Server,
  Manager:SocketManager,
) => {
  // Setup the socket listener, and add socket listener
  io.on(`connection`, socket => {
    try {
      const { token } = socket.handshake.auth
      if(!token) throw new Error(`Missing auth token`)

      const user = validateToken(token)

      // Setup the socket, and update connected peers
      Manager.setupSocket(socket)

      setupEvents(Manager, socket, config, io, user)

      // Call the connection event if it exists
      checkCall<TSocketEvtCBProps>(get(config, `events.connection`), {
        io,
        user,
        socket,
        config,
        Manager,
        event: 'connection',
      })

    }
    catch(err){
      Logger.info(`Error setting up websocket, force disconnecting...`)
      // Force disconnect the client if setup failed
      socket.disconnect(true)
    }

  })
}

export const socketInit = async (
  server:http.Server | https.Server,
  socketConfig:TSocketConfig,
):Promise<TSocketInit> => {

  const config = await buildConfig(socketConfig)

  // Create the socket server, and  attach to the express server
  const io = new Server({ path: config?.socket?.path })
  io.attach(server)

  // Setup the Socket Manager
  const Manager = setupManager(io)

  onConnect(config, io, Manager)

  return {
    io,
    config,
    Manager
  }

}