import type {
  TFeatureCB,
  TSetFeature,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TUpdateFeature,
  TAskForFeature,
  TSetFeatureRefs,
  TSetFeatureGroups,
  TUpdateFeatureOpts,
} from '@GBR/types'
import type { TExpanded, TOnExpandedCB } from '@GBR/contexts'

import { EUpdateType } from '@GBR/types'
import { emptyObj, get } from '@keg-hub/jsutils'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { generateId } from '@GBR/utils/helpers/generateId'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { useEventListen, useInline } from '@gobletqa/components'
import { isValidUpdate } from '@GBR/utils/features/isValidUpdate'
import { mapFeatureUpdate } from '@GBR/utils/features/mapFeatureUpdate'
import { updateEmptyFeature } from '@GBR/utils/features/updateEmptyFeature'


import {
  AskForFeatureEvt,
  SetFeatureContextEvt,
  UpdateFeatureContextEvt,
} from '@GBR/constants'

export type THFeatureCallbacks = {
  rootPrefix:string
  expanded:TExpanded
  feature?:TRaceFeature
  setFeature:TSetFeature
  featuresRef: TFeaturesRef
  updateEmptyTab:TFeatureCB
  onFeatureClose:TOnFeatureCB
  updateExpanded:TOnExpandedCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  onFeatureInactive?:TOnFeatureCB
  setFeatureGroups:TSetFeatureGroups
}

export type THandleUpdateType = TUpdateFeatureOpts & {
  expanded:TExpanded
  updated: TRaceFeature
  feature?: TRaceFeature
  updateExpanded:TOnExpandedCB
  changed?: Partial<TRaceFeature>
}

const handleUpdateType = (props:THandleUpdateType) => {
  const {
    op,
    type,
    path,
    replace,
    updated,
    expanded,
    updateExpanded
  } = props

    // Handle different update types
    if(op === EUpdateType.add){
      const prop = path ? get(updated, path) : emptyObj
      prop?.uuid && updateExpanded(generateId(updated, prop, type), true)
    }

    else if(op === EUpdateType.remove){
      
    }

    else if(op === EUpdateType.update){
      
    }

}

export const useFeatureCallbacks = (props:THFeatureCallbacks) => {

  const {
    feature,
    expanded,
    setFeature,
    featuresRef,
    updateEmptyTab,
    setFeatureRefs,
    updateExpanded,
    onFeatureChange,
    onFeatureInactive,
  } = props

  const _setFeature = useInline((feat?:TRaceFeature) => {
    // If a different feature is being set,
    // then call inactive callback on previous feature
    feat?.uuid !== feature?.uuid && onFeatureInactive?.(feature)

    setFeature(feat)
  })

  const updateFeature = useInline(async (
    changed?:Partial<TRaceFeature>,
    updateOpts:TUpdateFeatureOpts=emptyObj
  ) => {
    if(!changed || !isValidUpdate(changed)) return

    const updated = mapFeatureUpdate(
      changed,
      feature,
      updateOpts.replace,
    )

    // const updated = await ParkinWorker.updateFeature(
    //   changed,
    //   feature,
    //   replace,
    // )

    // handleUpdateType({
    //   updated,
    //   changed,
    //   feature,
    //   expanded,
    //   updateExpanded,
    //   ...updateOpts,
    // })

    onFeatureChange?.(updated, changed, feature)

    featuresRef.current[updated.uuid] = updated

    // If the updated feature was an empty feature
    // Remove the temp empty feature, and update the tab name
    // So the tab has the correct feature title
    if(feature?.uuid === EmptyFeatureUUID){
      delete featuresRef.current[EmptyFeatureUUID]
      updateEmptyTab?.(updated)
    }

    setFeatureRefs(featuresRef.current)
    setFeature(updated)

  })

  const setEmptyFeature = useInline(((feat:TRaceFeature) => {
    if(feat?.uuid === EmptyFeatureUUID){
      setFeatureRefs({ ...featuresRef.current, [EmptyFeatureUUID]: feat })
      updateEmptyTab?.(feat)
    }

    _setFeature(feat)
  }) as TOnFeatureCB)

  // Listen to external events to update the feature context
  // Allows dispatching update outside of the react context
  useEventListen<TUpdateFeature>(
    UpdateFeatureContextEvt,
    ({ feature, ...updateOpts }) => updateFeature(
      updateEmptyFeature(feature, featuresRef),
      updateOpts
    )
  )

  useEventListen<TRaceFeature>(
    SetFeatureContextEvt,
    setEmptyFeature
  )

  // Helper to allow external code ask the context for the current feature
  // Allows external actions to interface with the currently active feature
  useEventListen<TAskForFeature>(AskForFeatureEvt, ({ cb }) => cb?.({
    feature,
    updateFeature,
  }))

  return {
    updateFeature,
    setFeature: setEmptyFeature,
  }

}