import type http from 'http'
import type https from 'https'
import type { Express } from 'express'
import type { TSocketConfig, TProcConfig } from '@GSC/types'

import { Server } from 'socket.io'
import { Process } from '../process'
import { setupCmds } from './setupCmds'
import { setupEvents } from './setupEvents'
import { checkCall, get } from '@keg-hub/jsutils'
import { SocketManager } from '../manager/manager'

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
  app:Express,
  server:http.Server | https.Server,
  config:TSocketConfig,
  cmdGroup:string
) => {
  
  const io = new Server({ path: config?.path })
  // attache to the server
  io.attach(server)
  const Manager = new SocketManager()

  // Ensure we have access to the SocketIO class
  Manager.socketIo = Manager.socketIo || io

  // Configure authentication
  Manager.setAuth(config)

  // Create a new process instance
  const Proc = new Process(
    Manager,
    config.commands,
    config.filters,
    config.process as TProcConfig
  )

  onConnect(config, io, Manager, Proc)

}