import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

export const disconnect = (app:Express) => {
  return async ({ socket, Manager }:TSocketEvtCBProps) => {
    // TODO: Figure out how to get access to the user
    // Disconnect the user mounted repo is it exists when they disconnect
    // app.locals?.config?.server?.environment !== `local` &&
    //   await Repo.disconnect(user)

    let cache = Manager.cache[socket.id]
    if(!cache) return
    
    // Pass true to it closes the browser and page
    await cache?.recorder?.stop(true)

    cache = undefined
    Manager.cache[socket.id] = {}
  }
}

