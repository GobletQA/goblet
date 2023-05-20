import type {
  TFileTree,
  TRaceFiles,
  TFeatureFileModel
} from '@types'

import { useMemo } from 'react'
import { useFiles } from '@store'
import { FileTypes } from '@constants'
import { emptyObj } from '@keg-hub/jsutils'

const emptyFileTree = emptyObj as TFileTree

export const useFeatureFiles = (rootPrefix:string) => {
  const repoFiles = useFiles()
  const files = repoFiles?.files || emptyFileTree 

  return useMemo(() => {
    return Object.entries(files).reduce((acc, [loc, model]) => {
      // Add any files that are of type feature
      if(model?.ext === FileTypes.FEATURE)
        acc[loc] = model as TFeatureFileModel

      // Add any folders that are in the features folder
      // But skip the root directory
      else if(loc.startsWith(rootPrefix) && loc.endsWith(`/`)){
        const relative = loc.replace(rootPrefix, ``)
        if(relative !== `/`)
          acc[loc] = {
            uuid: loc,
            isDir: true,
            path: relative.replace(/\/$/, ``),
            parent: {
              uuid: loc,
              location: loc,
            }
          }
      }

      return acc
    }, {} as TRaceFiles) as TFileTree
  }, [files])
}