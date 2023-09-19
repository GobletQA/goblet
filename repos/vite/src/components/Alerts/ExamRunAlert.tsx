import { getStore } from '@store'
import { noOp } from '@keg-hub/jsutils'
import { Alert } from '@actions/modals/alert'
import { runExam } from '@actions/exam/runExam'
import {
  colors,
  stopEvent,
  AnimationPlayOutlineIcon,
} from '@gobletqa/components'
import {
  ModalTitle,
  ModalSubText,
  ModalContainer
} from '@components/Modals/Modal.styled'

export const ExamRunAlert = (evt?:any) => {
  evt && stopEvent(evt)
  const { app } = getStore().getState()

  return !app?.examRunning
    && Alert({
        titleProps: {
          Icon: <AnimationPlayOutlineIcon sx={{ color: colors.purple10}} />,
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
  
}