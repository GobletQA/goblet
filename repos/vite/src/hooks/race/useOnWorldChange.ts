import type { TRepoOpts, TFileModel } from '@types'
import type { TWorldConfig } from '@ltipton/parkin'

import { useRepo } from '@store'
import { useCallback } from 'react'


export type THOnWorldChange = {
  repo:TRepoOpts
  rootPrefix:string
  onSaveFile: (loc: string, content: string | null, ext?: Partial<TFileModel>) => Promise<void>

}

export const useOnWorldChange = (props:THOnWorldChange) => {
  const {
    repo,
    rootPrefix,
    onSaveFile
  } = props
  
  return useCallback((world:TWorldConfig) => {
    
    
    
  }, [
    repo,
    onSaveFile,
    rootPrefix,
  ])
}