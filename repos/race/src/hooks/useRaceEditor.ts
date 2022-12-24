import type { TRaceEditorProps } from '../types'
import { useRaceRefs } from './useRaceRefs'


export const useRaceEditor = (props:TRaceEditorProps) => {

  const {
    stepsRef,
    modelsRef,
    onModelChangeRef,
    onModelUpdateRef,
    onModelBeforeChangeRef
  } = useRaceRefs(props)

  return {
    stepsRef,
    modelsRef,
    onModelChangeRef,
    onModelUpdateRef,
    onModelBeforeChangeRef,
  }
}