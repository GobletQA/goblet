import { getModelFromPath } from './editor/getModelFromPath'

export const deleteModel = (path: string) => {
  const model = getModelFromPath(path)
  model ? model.dispose() : console.warn(`Could not find model from path ${path}`)
}
