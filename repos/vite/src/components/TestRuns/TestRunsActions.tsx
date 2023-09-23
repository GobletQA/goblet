import type { TTestsGetUICfgEvt, TExamUIRun } from '@types'

import { getStore } from '@store'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { runAllTests } from '@actions/testRuns/runAllTests'
import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'
import { TestsGetUICfgEvt, WSCancelTestRunEvt } from '@constants'
import {
  colors,
  CloseIcon,
  PlayCircleOutlineIcon,
} from '@gobletqa/components'

export const TestRunsCancelAction = {
  color: `error`,
  text: `Cancel`,
  variant: `contained`,
  StartIcon: CloseIcon,
  sx: { marginRight: `12px`, minWidth: `100px` },
  onClick: () => toggleTestRunsView(false),
}

export const TestRunsAbortAction = {
  color: `error`,
  text: `Abort`,
  variant: `contained`,
  StartIcon: CloseIcon,
  sx: { marginRight: `12px`, minWidth: `100px` },
  onClick: () => {
    const { testRuns } = getStore().getState()
    testRuns?.allTestsRunning
      && EE.emit(WSCancelTestRunEvt, {})
  },
}


export const TestRunsRunAction = {
  text: `Run`,
  color: `success`,
  keyboard: `enter`,
  variant: `contained`,
  StartIcon: PlayCircleOutlineIcon,
  sx: { color: colors.white, minWidth: `100px` },
  iconProps: { sx: { color: colors.white } },
  onClick: () => EE.emit<TTestsGetUICfgEvt>(
    TestsGetUICfgEvt,
    async (cfg:TExamUIRun) => await runAllTests(cfg)
  ),
}
