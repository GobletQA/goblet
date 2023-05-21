import type { TFileTree } from '@types'

import { ESideNav } from '@types'
import { useCallback } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { EditorPathChangeEvt, ToggleSideNavEvt } from '@constants'
import {emptyObj} from '@keg-hub/jsutils'

export type TPathOpts = {
  editor?:boolean
  sidebar?:boolean
}

export const useOnPathChange = () => {
  return useCallback(async (
    loc:string=``,
    opts:TPathOpts=emptyObj
  ) => {
    opts.editor !== false
      && EE.emit(EditorPathChangeEvt, { location: loc })

    opts.sidebar !== false
      && EE.emit(ToggleSideNavEvt, { open: false, name: ESideNav.Files })
  }, [])
}
