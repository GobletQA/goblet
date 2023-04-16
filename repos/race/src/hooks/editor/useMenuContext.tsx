import type { TRaceMenuItem, TRaceContextMenu } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'
import { useEditor } from '@GBR/contexts/EditorContext'

export const useMenuContext = (context?:keyof TRaceContextMenu) => {
  const editor = useEditor()
  return context
    ? editor?.menuContext?.[context] || emptyArr as TRaceMenuItem[]
    : emptyArr as TRaceMenuItem[]
}
