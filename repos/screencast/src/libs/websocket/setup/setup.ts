import type http from 'http'
import type https from 'https'
import type { TSocketConfig } from '@GSC/types'

import { Server } from 'socket.io'
import { setupConfig } from './setupConfig'
import { setupEvents } from './setupEvents'
import { validateToken } from './validateToken'
import { checkCall, get } from '@keg-hub/jsutils'
import { SocketManager } from '../manager/manager'

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
  // Setup the socket listener, and add socket commands listener
  io.on('connection', socket => {
    
    try {
      const { token } = socket.handshake.auth
      if(!token) throw new Error(`Missing auth token`)
      
      const data = validateToken(token)

      // Setup the socket, and update connected peers
      Manager.setupSocket(socket)

      // setupCmds(Manager, Proc, socket, config)
      setupEvents(Manager, socket, config, io)

      // Call the connection event if it exists
      checkCall(get(config, 'events.connection'), {
        io,
        socket,
        config,
        Manager,
        event: 'connection',
      })

    }
    catch(err){
      console.log(`Error setting up websocket, force disconnecting...`)
      // Force disconnect the client if setup failed
      socket.disconnect(true)

      console.error(err)
    }

  })
}

export const socketInit = async (
  server:http.Server | https.Server,
  socketConfig:TSocketConfig,
  cmdGroup:string
) => {

  const config = await setupConfig(socketConfig, cmdGroup)

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