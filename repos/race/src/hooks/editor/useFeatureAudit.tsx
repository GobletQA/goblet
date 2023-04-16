import type { TRaceFeature } from '@GBR/types'
import type { MutableRefObject } from 'react'
import type { TWorldConfig, TStepDefsList } from '@ltipton/parkin'

import { useCallback } from 'react'
import { EditorWorker } from '@GBR/workers/editor/editorWorker'


export type THFeatureAudit = {
  defs:TStepDefsList
  world:TWorldConfig
  feature?:TRaceFeature
}


export const useFeatureAudit = (props:THFeatureAudit) => {
  const {
    defs,
    world,
  } = props
  
  const auditFeature = useCallback((feature?:TRaceFeature) => {
    
  }, [
    defs,
    world
  ])

  return {
    auditFeature
  }
}