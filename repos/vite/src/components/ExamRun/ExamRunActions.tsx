import type { TExamGetExamUICfgEvt, TExamUIRun } from '@types'
import type { TModalAction } from '@gobletqa/components'

import { getStore } from '@store'
import { ExamGetExamUICfgEvt, WSCancelExamEvent } from '@constants'
import { runExam } from '@actions/exam/runExam'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {toggleModal} from '@actions/modals/toggleModal'
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
  onClick: () => toggleModal(false),
}

export const ExamAbortAction = {
  color: `error`,
  text: `Abort`,
  variant: `contained`,
  StartIcon: CloseIcon,
  sx: { marginRight: `12px`, minWidth: `100px` },
  onClick: () => {
    const { app } = getStore().getState()
    app?.examRunning
      && EE.emit(WSCancelExamEvent, {})
  },
}

const onExamRun = async () => {
  EE.emit<TExamGetExamUICfgEvt>(ExamGetExamUICfgEvt, (cfg:TExamUIRun) => {
    console.log(`------- exam run -------`)
    console.log(cfg)
    // await runExam()
  })
}

export const ExamRunAction = {
  text: `Run`,
  color: `success`,
  keyboard: `enter`,
  variant: `contained`,
  StartIcon: PlayCircleOutlineIcon,
  sx: { color: colors.white, minWidth: `100px` },
  iconProps: { sx: { color: colors.white } },
  onClick: onExamRun,
}
