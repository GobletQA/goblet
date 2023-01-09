
import { getModelFromPath } from './getModelFromPath'

export const getContentFromPath = (location:string) => {
  const model = getModelFromPath(location)
  return model?.getValue?.()
}