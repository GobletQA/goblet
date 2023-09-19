import {
  ExamRunBtn,
  ExamRunIcon,
  ExamRunText
} from './RunExamButton.styled'
import { examModal } from '@actions/modals/modals'

export const RunExamButton = () => {
  return (
    <ExamRunBtn
      Icon={ExamRunIcon}
      onClick={() => examModal()}
      text={(
        <ExamRunText>
          Run Test Suite
        </ExamRunText>
      )}
    />
  )
}