import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

export const connection = (app:Express) => {
  return ({ socket, Manager }:TSocketEvtCBProps) => {

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'goblet'

  }
}

