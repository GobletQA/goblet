import type { TRaceEditorProps } from '../types'
import { useRaceRefs } from './useRaceRefs'
import { useOpenedTabs } from './useOpenedTabs'

export type TEditorExt = {
  resizeSidebar: (width:number) => void
}

export const useRaceEditor = (props:TRaceEditorProps, ext:TEditorExt) => {

  const raceRefs = useRaceRefs(props)
  const openedTabs = useOpenedTabs(props, raceRefs)

  return {
    ...raceRefs,
    ...openedTabs
  }
}