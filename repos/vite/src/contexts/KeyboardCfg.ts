import type { TKeyboard } from '@types'

import {
  CancelButtonID,
  WSCancelTestRunEvt,
  BrowserStateAttrKey,
  WSCancelPlayerEvent,
  WSCancelAutomateEvent,
} from '@constants'

import { getStore } from '@store'
import { EBrowserState } from '@types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { getFileModel } from '@utils/files/getFileModel'
import { getActiveFile } from '@utils/editor/getActiveFile'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'

const cancelAutomation = async () => {
  const { app } = getStore().getState()

  // TODO: investigate moving this to its own function
  if(app.allTestsRunning){
    EE.emit(WSCancelTestRunEvt, {})
    return
  }

  const cancelBtn = document.querySelector<HTMLButtonElement>(`#${CancelButtonID}`)
  if(!cancelBtn) return console.log(`[Key-Cmd] - Cancel action not found`)

  const browserState = cancelBtn?.dataset?.[BrowserStateAttrKey]
  if(!browserState) return console.log(`[Key-Cmd] - Browser state not found on Cancel action`)
  
  if(browserState === EBrowserState.idle)
    return console.log(`[Key-Cmd] - Can not cancel browser automation in idle state`)

  const event = browserState === EBrowserState.playing ? WSCancelPlayerEvent : WSCancelAutomateEvent
  EE.emit(event, {})
}

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
    action: cancelAutomation
  },
  escape: { action: cancelAutomation }
}
