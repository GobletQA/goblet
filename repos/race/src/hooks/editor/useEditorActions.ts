import type { TTabAction, TTabItem } from '@gobletqa/components'
import type {
  TFeaturesRef,
  TOnFeatureCB,
  TOnEditFeature,
  TOnCloseFeature,
  TOnActiveFeature,
  TOnDeleteFeature,
} from '@GBR/types'

import { useCallback } from 'react'
import { useEditor } from '@GBR/contexts'


export type THEditorActions = {
  featuresRef:TFeaturesRef
  onFeatureClose?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  onFeatureInactive?:TOnFeatureCB
}

export const useEditorActions = (props:THEditorActions) => {

  const {
    onFeatureClose,
    onFeatureActive,
  } = props

  const { feature, setFeature } = useEditor()

  /**
   * On feature inactive called in the setFeature method when the feature uuid changes
   */
  const onActiveFeature = useCallback<TOnActiveFeature>((_, feat) => {
    if(feat?.uuid === feature?.uuid) return

    setFeature(feat)
    feat && onFeatureActive?.(feat)
  }, [feature])

  const onCloseFeature = useCallback<TOnCloseFeature>((_, feat, nextFeat) => {
    onFeatureClose?.(feat)
    setFeature(nextFeat)
    nextFeat && onFeatureActive?.(nextFeat)
  }, [feature, setFeature])


 // TODO: update these to actually change the file
  const onEditFeature = useCallback<TOnEditFeature>(() => {
    console.log(`------- editing feature -------`)
  }, [])
  
  const onDeleteFeature = useCallback<TOnDeleteFeature>(() => {
    console.log(`------- delete feature -------`)
  }, [])

  return {
    onEditFeature,
    onCloseFeature,
    onDeleteFeature,
    onActiveFeature,
  }
}
