import type http from 'http'
import type https from 'https'
import type { TSocketConfig, TProcConfig } from '@GSC/types'

import { Server } from 'socket.io'
import { Process } from '../process'
import { setupCmds } from './setupCmds'
import { setupConfig } from './setupConfig'
import { setupEvents } from './setupEvents'
import { checkCall, get } from '@keg-hub/jsutils'
import { SocketManager } from '../manager/manager'

const setupManager = (
  config:TSocketConfig,
  io:Server
) => {
  // Setup the Socket Manager
  const Manager = new SocketManager()
  // Ensure we have access to the SocketIO class
  Manager.socketIo = Manager.socketIo || io
  // Configure authentication
  Manager.setAuth(config)
  
  return Manager
}

export const onConnect = (
  config:TSocketConfig,
  io:Server,
  Manager:SocketManager,
  Proc:Process
) => {
  // Setup the socket listener, and add socket commands listener
  io.on('connection', socket => {
    Manager.checkAuth(socket, 'connection', {}, () => {
      setupCmds(Manager, Proc, socket, config)
      setupEvents(Manager, socket, config, io)
      // Call the connection event if it exists
      checkCall(get(config, 'events.connection'), {
        io,
        socket,
        config,
        Manager,
        event: 'connection',
      })
    })
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
  const Manager = setupManager(config, io)

  // Create a new process instance
  const Proc = new Process(
    Manager,
    config.commands,
    config.filters,
    config.process as TProcConfig
  )

  onConnect(config, io, Manager, Proc)

  return {
    io,
    config,
    Manager,
    Process: Proc,
  }

}