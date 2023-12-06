import type { TKeyboard, TTestRunGetUICfgEvt, TTestRunUICfg } from '@types'

import {
  CancelButtonID,
  WSCancelTestRunEvt,
  BrowserStateAttrKey,
  WSCancelPlayerEvent,
  WSCancelAutomateEvent,
  TestRunGetUICfgEvt,
} from '@constants'

import { getStore } from '@store'
import { EBrowserState } from '@types'
import { EE } from '@services/sharedService'
import { getFileModel } from '@utils/files/getFileModel'
import {runAllTests} from '@actions/testRuns/runAllTests'
import { getActiveFile } from '@utils/editor/getActiveFile'
import { startBrowserPlay } from '@actions/runner/startBrowserPlay'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'

const cancelAutomation = async () => {
  const { testRuns } = getStore().getState()

  // TODO: investigate moving this to its own function
  if(testRuns.allTestsRunning)
    return EE.emit(WSCancelTestRunEvt, {})

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
    description: (
      <span>
        Clears decorators from the active test file
      </span>
    ),
    combo:[`shift`, `ctrl`], 
    action: async () => {
      const { location } = await getActiveFile()
      if(!location) return console.log(`[Key-Cmd] - No active file not found`)

      clearEditorDecorations(location)
    }
  },
  r: {
    description: (
      <span>
        Attempts to run the currently active test file if one exists. If the Test Suite view is open, it will attempt to run the mounted repositories full Test Suite instead.
      </span>
    ),
    combo:[`shift`, `ctrl`], 
    action: async () => {
      const { app } = getStore().getState()
      if(app.testRunsView)
        return EE.emit<TTestRunGetUICfgEvt>(TestRunGetUICfgEvt, (cfg:TTestRunUICfg) => runAllTests(cfg))

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
    action: cancelAutomation,
    description: (
      <span>
        Attempts to cancel the currently test execution or automation. Works for both single Test files, and the full Test Suite.
      </span>
    ),
  },
  escape: {
    action: cancelAutomation,
    description: (
      <span>
        Attempts to cancel the currently test execution or automation. Works for both single Test files, and the full Test Suite.
      </span>
    ),
  }
}

