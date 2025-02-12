import type { MouseEventHandler, ComponentProps } from 'react'

import { useTestRuns } from '@store'
import { toggleTestRunsView } from '@actions/testRuns/toggleTestRunsView'
import {
  colors,
  Tooltip,
  gutter,
  IconButton,
  FolderPlayOutlineIcon,
} from '@gobletqa/components'

export type TTestRunsIcon = ComponentProps<typeof FolderPlayOutlineIcon>

const styles = {
  tests: {
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
  const iconSx = allTestsRunning ? styles.tests.running : styles.tests.idle

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
        <FolderPlayOutlineIcon sx={iconSx} />
      </IconButton>
    </Tooltip>
  )
}

export const TestRunsAction = {
  id:`test-runs-action`,
  action: () => toggleTestRunsView(),
  className:`goblet-tests-run`,
  Component: TestRunsActionComp,
}