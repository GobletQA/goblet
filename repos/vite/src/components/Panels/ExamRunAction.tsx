import type { MouseEventHandler, ComponentProps } from 'react'

import { getStore, useApp } from '@store'
import { runExam } from '@actions/exam/runExam'
import {
  colors,
  Tooltip,
  gutter,
  stopEvent,
  IconButton,
  DirectionsRunIcon,
} from '@gobletqa/components'

export type TExamIcon = ComponentProps<typeof DirectionsRunIcon>

const styles = {
  exam: {
    running: {
      fontSize: `16px`,
      color: colors.gray10,
    },
    idle: {
      fontSize: `16px`,
      color: colors.green10,
    }
  },
  button: {
    padding: `0px`,
    pointerEvents: `auto`,
    marginRight: gutter.margin.qpx,
  }
}

const ExamRunActionComp = (props:TExamIcon) => {
  const { examRunning } = useApp()
  const iconSx = examRunning ? styles.exam.running : styles.exam.idle

  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Run Entire Test Suite`}
    >
      <IconButton
        sx={styles.button}
        disabled={examRunning}
        onClick={props?.onClick as MouseEventHandler<HTMLButtonElement>|undefined}
      >
        <DirectionsRunIcon sx={iconSx} />
      </IconButton>
    </Tooltip>
  )
}

export const ExamRunAction = {
  id:`exam-run-action`,
  Component: ExamRunActionComp,
  className:`goblet-exam-run`,
  action:(evt:Event) => {
    // TODO: Add confirmation model here

    stopEvent(evt)
    const { app } = getStore().getState()
    const { examRunning } = app
    !examRunning && runExam()
  },
}