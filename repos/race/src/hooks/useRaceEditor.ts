import type { TRaceEditorProps } from '../types'
import { useRaceRefs } from './useRaceRefs'

export type TEditorExt = {
  resizeSidebar: (width:number) => void
}

export const useRaceEditor = (props:TRaceEditorProps, ext:TEditorExt) => {

  const {
    stepsRef,
    featuresRef,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef
  } = useRaceRefs(props)

  return {
    stepsRef,
    featuresRef,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef,
  }
}