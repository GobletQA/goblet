import type {
  TRaceFeatures,
  TRaceFeatureGroup,
  TEditorFeatureActions
} from '@GBR/types'

import { useCallback } from 'react'
import { stopPropagation } from '@gobletqa/components'
import { createFeatureGroup } from '@GBR/actions/featureGroups/createFeatureGroup'
import { editFeatureGroupName } from '@GBR/actions/featureGroups/editFeatureGroupName'

export type THFeatureItemHooks = TEditorFeatureActions & {
  featureGroups:TRaceFeatures
  featureGroup:TRaceFeatureGroup
}

export const useFeatureGroupHooks = (props:THFeatureItemHooks) => {
  const { featureGroup } = props

  const onEditName = useCallback((evt: Event) => {
    stopPropagation(evt)
    editFeatureGroupName({ featureGroup, editing: true })
  }, [featureGroup])

  const onCreateGroup = useCallback((evt:any) => {
    stopPropagation(evt)
    createFeatureGroup({ featureGroup })
  }, [featureGroup])
  
  const onCreateFeature = useCallback((evt:any) => {
    stopPropagation(evt)
    // createFeature({ featureGroup })
  }, [featureGroup])

  const onDeleteGroup = useCallback((evt:any) => {
    stopPropagation(evt)
    console.log(`------- on delete group -------`)
  }, [featureGroup])

  return {
    onEditName,
    onCreateGroup,
    onDeleteGroup,
    onCreateFeature,
  }
}