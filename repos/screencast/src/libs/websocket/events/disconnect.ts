import type { Express } from 'express'


export const disconnect = (app:Express) => {
  return async ({ socket, Manager }, tokenData:string) => {

    // TODO: Figure out how to get access to the user
    // Disconnect the user mounted repo is it exists when they disconnect
    // app.locals?.config?.server?.environment !== `local` &&
    //   await Repo.disconnect(user)

    const cache = Manager.cache[socket.id]
    // Pass true to it closes the browser and page
    cache && cache.recorder && await cache.recorder.stop(true)
  }
}

