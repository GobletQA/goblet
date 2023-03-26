import type { TFileTree } from '@types'

import { ESideNav } from '@types'
import { useCallback } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { EditorPathChangeEvt, ToggleSideNavEvt } from '@constants'

export const useOnPathChange = () => {
  return useCallback(async (loc:string) => {
    EE.emit(EditorPathChangeEvt, { location: loc })
    EE.emit(ToggleSideNavEvt, { open: false, name: ESideNav.Files })
  }, [])
}
