import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TUserAutomateOpts,
  TSocketEvtCBProps,
} from '@GSC/types'

const onExamRun = async (
  data:TUserAutomateOpts,
  socket:Socket,
  Manager:SocketManager,
  app:Express
) => {


}

export const examRun = (app:Express) => {
  return async ({ data, socket, Manager, user }:TSocketEvtCBProps) => {
    console.log(`------- data -------`)
    console.log(data)
    console.log(`------- user -------`)
    console.log(user)
    
    await onExamRun(data, socket, Manager, app)
  }
}
