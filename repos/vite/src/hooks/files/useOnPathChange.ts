import type { TFileTree } from '@types'

import { ESideNav } from '@types'
import { useCallback } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { localStorage } from '@services/localStorage'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { EditorPathChangeEvt, ToggleSideNavEvt } from '@constants'

export type TPathOpts = {
  // TODO:
  // Monaco passes the relative path to the goblet dir
  // Local Storage and Race uses the full path location
  // This opt, allows monaco to pass the the full location without impacting other places
  // At some point monaco should be fixed to also use the full location
  // This is just a work-around
  fullLoc?:string
  /**
   * Old path location, that is no longer current
   * Exists when a file is closed, and the new location is an empty string
   */
  oldLoc?:string
  editor?:boolean
  sidebar?:boolean
  storage?:boolean
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

    const add = opts?.fullLoc || loc

    opts.storage !== false
      && (add || opts.oldLoc)
      && localStorage.opLastOpened({ add, remove: opts.oldLoc })
  }, [])
}
