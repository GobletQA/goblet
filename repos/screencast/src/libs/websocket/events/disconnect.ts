import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'
import { Repo } from '@gobletqa/shared/repo/repo'

export const disconnect = (app:Express) => {
  return async ({ socket, Manager }:TSocketEvtCBProps) => {

    let cache = Manager.cache[socket.id]
    if(!cache) return

    /*
     * When in production, ensure the user repo is disconnected when they disconnect
     * This should not happen right way,
     * Need a way to start a job, and then cancel it
     * if the user reconnects within some amount of time
     */

    //  app.locals?.config?.server?.environment === `production`
    //   && cache.username
    //   && await Repo.disconnect({ username: cache.username })

    // Pass true to it closes the browser and page
    await cache?.recorder?.stop(true)

    cache = undefined
    Manager.cache[socket.id] = {}

  }
}

