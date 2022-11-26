import type { Socket } from 'socket.io'
import type { TSocketConfig, TSockrEvents } from '@GSC/types'

import { Server } from 'socket.io'
import { SocketManager } from '../manager/manager'
import { checkCall, noOpObj, isFunc } from '@keg-hub/jsutils'


/**
 * Sets up custom websocket events base on the config.events object
 */
export const setupEvents = (
  Manager:SocketManager,
  socket:Socket,
  config:TSocketConfig,
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

