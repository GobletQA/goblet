import type { MouseEventHandler, ComponentProps } from 'react'

import { getStore, useApp } from '@store'
import { Alert } from '@actions/modals/alert'
import { runExam } from '@actions/exam/runExam'
import {
  colors,
  Tooltip,
  gutter,
  stopEvent,
  IconButton,
  DirectionsRunIcon,
} from '@gobletqa/components'
import {
  ModalTitle,
  ModalSubText,
  ModalContainer
} from '@components/Modals/Modal.styled'
import {noOp} from '@keg-hub/jsutils'

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
      title={`Run Test Suite`}
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
    stopEvent(evt)
    const { repo, app } = getStore().getState()
    if(app?.examRunning) return
    
    const name = repo?.git?.repoName || repo?.name || `current`

    Alert({
      titleProps: {
        Icon: <DirectionsRunIcon sx={{ color: colors.purple10}} />,
      },
      title: `Run Test Suite`,
      okText: `Yes`,
      onOk: () => {
        runExam()
      },
      cancelText: `No`,
      onCancel: noOp,
      content: (
        <ModalContainer>
          <ModalTitle>
            Would you like to run the entire Test Suite?
          </ModalTitle>
          <ModalSubText>
            All feature files will be executed in succession.
          </ModalSubText>
          <ModalSubText>
            During execution the Goblet application will be disabled.
          </ModalSubText>
        </ModalContainer>
      ),
    })


  },
}