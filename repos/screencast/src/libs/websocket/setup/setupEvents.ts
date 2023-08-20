import type { Socket } from 'socket.io'
import type {
  TTokenUser,
  TSocketEvents,
  TSocketConfig,
  TSocketEventCB,
  TSocketEvtCBProps,
} from '@GSC/types'

import { Server } from 'socket.io'
import { SocketManager } from '../manager/manager'
import { isFunc } from '@keg-hub/jsutils/isFunc'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { checkCall } from '@keg-hub/jsutils/checkCall'

export type TCustomEvt = {
  io:Server
  name:string
  socket:Socket
  user: TTokenUser,
  config:TSocketConfig
  method:TSocketEventCB
  Manager:SocketManager
}

type TDisconnectEvt = Omit<TCustomEvt, 'name'>

const handelCustomEvt = ({
  io,
  user,
  name,
  socket,
  method,
  config,
  Manager,
}:TCustomEvt) => {
  socket.on(name, async (data:Record<any, any>) => {
    checkCall<TSocketEventCB>(method, {
      io,
      data,
      user,
      socket,
      config,
      Manager,
      event: name,
    } as TSocketEvtCBProps)
  })
}

const handleDisconnect = ({
  io,
  user,
  socket,
  method,
  config,
  Manager,
}:TDisconnectEvt) => {
  socket.on('disconnect', async (data) => {
    // If there's an disconnect event
    // Call it first and catch any errors it throws
    // then call the Manager.onDisconnect to ensure it's called
    // Finally re-throw the error if one waw caught
    let disconnectError
    try {
      isFunc(method) &&
        (await method({
          io,
          user,
          socket,
          config,
          Manager,
          event: 'disconnect',
          data: { message: data },
        } as TSocketEvtCBProps))
    }
    catch (err) {
      disconnectError = err
    }
    Manager.onDisconnect(socket)

    if (disconnectError) throw disconnectError
  })

}

/**
 * Sets up custom websocket events base on the config.events object
 */
export const setupEvents = (
  Manager:SocketManager,
  socket:Socket,
  config:TSocketConfig,
  io:Server,
  user:TTokenUser
) => {
  const { events = noOpObj as TSocketEvents } = config

  // Ensure the onDisconnect event get attached to the socket if no disconnect event
  !events.disconnect &&
    socket.on('disconnect', _ => Manager.onDisconnect(socket))

  Object.entries(events).map(([ name, method ]) => {
    name !== 'connection' && name !== 'disconnect'
      ? handelCustomEvt({
          io,
          user,
          name,
          socket,
          method,
          config,
          Manager,
        })
      : name === 'disconnect' &&
        handleDisconnect({
          io,
          user,
          method,
          socket,
          config,
          Manager,
        })
  })
}

