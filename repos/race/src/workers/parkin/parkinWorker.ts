// import * as ComLink from 'comlink'

export const ParkinWorker = new ComlinkWorker<typeof import('./parkin')>(
  new URL('./parkin', import.meta.url)
)

