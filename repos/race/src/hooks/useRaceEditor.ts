import type { TRaceEditorProps } from '../types'
import { useRaceRefs } from './useRaceRefs'


export const useRaceEditor = (props:TRaceEditorProps) => {

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