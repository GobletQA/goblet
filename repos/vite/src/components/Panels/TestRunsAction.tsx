import type { MouseEventHandler, ComponentProps } from 'react'

import { useTestRuns } from '@store'
import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'
import {
  colors,
  Tooltip,
  gutter,
  IconButton,
  AnimationPlayOutlineIcon,
} from '@gobletqa/components'

export type TTestRunsIcon = ComponentProps<typeof AnimationPlayOutlineIcon>

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

const TestRunsActionComp = (props:TTestRunsIcon) => {
  const { allTestsRunning } = useTestRuns()
  const iconSx = allTestsRunning ? styles.exam.running : styles.exam.idle

  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Run Test Suite`}
    >
      <IconButton
        sx={styles.button}
        disabled={allTestsRunning}
        onClick={props?.onClick as MouseEventHandler<HTMLButtonElement>|undefined}
      >
        <AnimationPlayOutlineIcon sx={iconSx} />
      </IconButton>
    </Tooltip>
  )
}

export const TestRunsAction = {
  id:`test-runs-action`,
  action: () => toggleTestRunsView(),
  className:`goblet-exam-run`,
  Component: TestRunsActionComp,
}