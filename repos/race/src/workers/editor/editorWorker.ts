// import * as ComLink from 'comlink'

export const EditorWorker = new ComlinkWorker<typeof import('./editor')>(
  new URL('./editor', import.meta.url)
)

