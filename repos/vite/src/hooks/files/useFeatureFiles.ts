import type { TFeatureFileModelList, TFeatureFileModel, TFileTree } from '@types'

import { useMemo } from 'react'
import { useFiles } from '@store'
import { FileTypes } from '@constants'
import { emptyObj } from '@keg-hub/jsutils'

const emptyFileTree = emptyObj as TFileTree

export const useFeatureFiles = () => {
  const repoFiles = useFiles()
  const files = repoFiles?.files || emptyFileTree 

  return useMemo(() => {
    return Object.entries(files).reduce((acc, [loc, model]) => {
      model?.ext === FileTypes.FEATURE
        && (acc[loc] = model as TFeatureFileModel)

      return acc
    }, {} as TFeatureFileModelList)
  }, [files])
}