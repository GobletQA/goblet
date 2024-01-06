export const AppWorker = new ComlinkWorker<typeof import('./appWorker')>(
  new URL('./appWorker', import.meta.url)
)

