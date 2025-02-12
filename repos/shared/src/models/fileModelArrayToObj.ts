import type { TFileModel } from '@GSH/types'

/**
 * Helper to help map the fileModel array to object with location as the unique key
 */
export const fileModelArrayToObj = <T=Record<string, TFileModel>>(fileModels:TFileModel[]) => {
  return (
    fileModels &&
    fileModels.reduce((map, fileModel) => {
      fileModel.location && (map[fileModel.location] = fileModel)
      return map
    }, {} as T)
  )
}
