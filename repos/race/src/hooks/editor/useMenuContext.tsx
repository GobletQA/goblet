import type { TRaceMenuItem, TRaceContextMenu, TExpPart } from '@GBR/types'

import { emptyArr } from '@keg-hub/jsutils'
import { useEditor } from '@GBR/contexts/EditorContext'

export const useMenuContext = (context?:keyof TRaceContextMenu, active?:TExpPart) => {
  const editor = useEditor()
  const items = context
    ? editor?.menuContext?.[context] || emptyArr as TRaceMenuItem[]
    : emptyArr as TRaceMenuItem[]
  
  return !active || !active?.kind || !items?.length
    ? items
    : items.filter(item => {
        return item?.filter?.length
          ? item?.filter?.includes?.(active?.kind || ``)
          : item
      })

}
