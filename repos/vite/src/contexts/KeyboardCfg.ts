import type { TKeyboard } from '@types'

import {
  CancelButtonID,
  BrowserStateAttrKey,
  WSCancelPlayerEvent,
  WSCancelAutomateEvent,
} from '@constants'

import { EBrowserState } from '@types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { getFileModel } from '@utils/files/getFileModel'
import { getActiveFile } from '@utils/editor/getActiveFile'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'

export const KeyboardCfg:TKeyboard = {
  active: true,
  z: {
    combo:[`shift`, `ctrl`], 
    action: async () => {
      const { location } = await getActiveFile()
      if(!location) return console.log(`[Key-Cmd] - No active file not found`)

      clearEditorDecorations(location)
    }
  },
  r: {
    combo:[`shift`, `ctrl`], 
    action: async () => {

      const { location } = await getActiveFile()
      if(!location) return console.log(`[Key-Cmd] - No active file not found`)
        
      const fileModel = getFileModel(location)
      if(!fileModel) return console.log(`[Key-Cmd] - Missing file model for ${location}`)

      clearEditorDecorations(location)
      startBrowserPlay(fileModel)
    }
  },
  c: {
    combo:[`shift`, `ctrl`],
    action: async () => {
      const cancelBtn = document.querySelector<HTMLButtonElement>(`#${CancelButtonID}`)
      if(!cancelBtn) return console.log(`[Key-Cmd] - Cancel action not found`)

      const browserState = cancelBtn?.dataset?.[BrowserStateAttrKey]
      if(!browserState) return console.log(`[Key-Cmd] - Browser state not found on Cancel action`)
      
      if(browserState === EBrowserState.idle)
        return console.log(`[Key-Cmd] - Can not cancel browser automation in idle state`)

      const event = browserState === EBrowserState.playing ? WSCancelPlayerEvent : WSCancelAutomateEvent
      EE.emit(event, {})
    }
  }
}
