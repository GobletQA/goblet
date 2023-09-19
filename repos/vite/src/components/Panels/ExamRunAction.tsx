import type { MouseEventHandler, ComponentProps } from 'react'

import { useApp } from '@store'
import { ExamRunAlert } from '@components/Alerts/ExamRunAlert'
import {
  colors,
  Tooltip,
  gutter,
  IconButton,
  AnimationPlayOutlineIcon,
} from '@gobletqa/components'

export type TExamIcon = ComponentProps<typeof AnimationPlayOutlineIcon>

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
      title={`Run Full Test Suite`}
    >
      <IconButton
        sx={styles.button}
        disabled={examRunning}
        onClick={props?.onClick as MouseEventHandler<HTMLButtonElement>|undefined}
      >
        <AnimationPlayOutlineIcon sx={iconSx} />
      </IconButton>
    </Tooltip>
  )
}

export const ExamRunAction = {
  id:`exam-run-action`,
  action: ExamRunAlert,
  className:`goblet-exam-run`,
  Component: ExamRunActionComp,
}