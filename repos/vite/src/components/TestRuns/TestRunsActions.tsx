import type { TTestsGetExamUICfgEvt, TExamUIRun } from '@types'
import type { TModalAction } from '@gobletqa/components'

import { getStore } from '@store'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { runAllTests } from '@actions/testRuns/runAllTests'
import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'
import { TestsGetExamUICfgEvt, WSCancelTestRunEvt } from '@constants'
import {
  colors,
  CloseIcon,
  PlayCircleOutlineIcon,
} from '@gobletqa/components'

export const ExamCancelAction = {
  color: `error`,
  text: `Cancel`,
  variant: `contained`,
  StartIcon: CloseIcon,
  sx: { marginRight: `12px`, minWidth: `100px` },
  onClick: () => toggleTestRunsView(false),
}

export const ExamAbortAction = {
  color: `error`,
  text: `Abort`,
  variant: `contained`,
  StartIcon: CloseIcon,
  sx: { marginRight: `12px`, minWidth: `100px` },
  onClick: () => {
    const { app } = getStore().getState()
    app?.allTestsRunning
      && EE.emit(WSCancelTestRunEvt, {})
  },
}


export const TestRunsAction = {
  text: `Run`,
  color: `success`,
  keyboard: `enter`,
  variant: `contained`,
  StartIcon: PlayCircleOutlineIcon,
  sx: { color: colors.white, minWidth: `100px` },
  iconProps: { sx: { color: colors.white } },
  onClick: () => EE.emit<TTestsGetExamUICfgEvt>(
    TestsGetExamUICfgEvt,
    async (cfg:TExamUIRun) => await runAllTests(cfg)
  ),
}
