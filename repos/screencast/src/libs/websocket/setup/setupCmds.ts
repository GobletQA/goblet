import type { Socket } from 'socket.io'
import type { Process } from '../process'
import type { TSocketConfig } from '@GSC/types'
import type { SocketManager } from '../manager/manager'


/**
 * Sets up the commands that can be run by the backend socket
 */
export const setupCmds = (
  Manager:SocketManager,
  Proc:Process,
  socket:Socket,
  config:TSocketConfig
) => {
  // Setup the socket, and update connected peers
  Manager.setupSocket(socket)

  // Setup the socket to listen for commands to run
  Proc.bindSocket(socket)
}
