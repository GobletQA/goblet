import type { TFilesState } from '@types'

import { ESideNav } from '@types'
import { useCallback } from 'react'
import { ToggleSideNavEvt } from '@constants'
import { addRootToLoc } from '@utils/repo/addRootToLoc'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { setActiveFile } from '@actions/files/local/setActiveFile'

export const useOnPathChange = (repoFiles:TFilesState, rootPrefix:string) => {
  return useCallback(async (loc:string) => {
    if(!loc) console.warn(`Can not set active file, missing file location`)

    const fullLoc = addRootToLoc(loc, rootPrefix)
    setActiveFile(fullLoc)

    EE.emit(ToggleSideNavEvt, { open: false, name: ESideNav.Files })

  }, [repoFiles, rootPrefix])
}
