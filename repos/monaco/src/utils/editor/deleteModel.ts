import { getModelFromPath } from './getModelFromPath'

export const deleteModel = (path: string) => {
  const model = getModelFromPath(path)
  model ? model.dispose() : console.warn(`Could not find model from path ${path}`)
}
