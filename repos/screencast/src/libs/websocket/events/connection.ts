import type { Express } from 'express'

export const connection = (app:Express) => {
  return ({ socket, Manager }) => {

    // Todo Update to be the group / room name for the connected user
    const cache = Manager.cache[socket.id]
    cache.groupId = 'goblet'

  }
}

