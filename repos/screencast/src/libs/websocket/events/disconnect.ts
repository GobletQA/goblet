import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

export const disconnect = (app:Express) => {
  return async ({ socket, Manager }:TSocketEvtCBProps) => {

    let cache = Manager.cache[socket.id]
    if(!cache) return

    // Pass true to it closes the browser and page
    await cache?.recorder?.stop(true)

    cache = undefined
    Manager.cache[socket.id] = {}
    delete Manager.cache[socket.id]

  }
}

