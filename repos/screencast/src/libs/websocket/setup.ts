import type http from 'http'
import type https from 'https'
import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { TSockrConfig, TSockrEvents } from '@GSC/types'

import { Server } from 'socket.io'
import { Process } from './process'
import { SocketManager } from './socketManager'
import { checkCall, get, noOpObj, isFunc } from '@keg-hub/jsutils'

/**
 * Sets up the commands that can be run by the backend socket
 */
const setupSocketCmds = (
  Manager:SocketManager,
  Proc:Process,
  socket:Socket,
  config:TSockrConfig
) => {
  // Setup the socket, and update connected peers
  Manager.setupSocket(socket, config.commands)

  // Setup the socket to listen for commands to run
  Proc.bindSocket(socket)
}

/**
 * Sets up custom websocket events base on the config.events object
 */
const setupSocketEvents = (
  Manager:SocketManager,
  socket:Socket,
  config:TSockrConfig,
  io:Server
) => {
  const { events = noOpObj as TSockrEvents } = config

  // Ensure the onDisconnect event get attached to the socket if no disconnect event
  !events.disconnect &&
    socket.on('disconnect', _ => Manager.onDisconnect(socket))

  Object.entries(events).map(([ name, method ]) => {
    name !== 'connection' && name !== 'disconnect'
      ? socket.on(name, async (data:Record<any, any>) => {
        Manager.checkAuth(socket, name, data, () => {
          checkCall(method as any, {
            data,
            socket,
            config,
            event: name,
            Manager,
            io,
          })
        })
      })
      : name === 'disconnect' &&
        socket.on(name, async data => {
          // If there's an disconnect event
          // Call it first and catch any errors it throws
          // then call the Manager.onDisconnect to ensure it's called
          // Finally re-throw the error if one waw caught
          let disconnectError
          try {
            isFunc(method) &&
              (await method({
                io,
                data,
                socket,
                config,
                Manager,
                event: name,
              }))
          }
          catch (err) {
            disconnectError = err
          }
          Manager.onDisconnect(socket)

          if (disconnectError) throw disconnectError
        })
  })
}


export const socketInit = async (
  app:Express,
  server:http.Server | https.Server,
  config:TSockrConfig,
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
    config.process
  )

  // Setup the socket listener, and add socket commands listener
  io.on('connection', socket => {
    Manager.checkAuth(socket, 'connection', {}, () => {
      setupSocketCmds(Manager, Proc, socket, config)
      setupSocketEvents(Manager, socket, config, io)
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