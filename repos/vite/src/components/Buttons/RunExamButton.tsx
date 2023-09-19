import { runExam } from '@actions/exam/runExam'
import {
  ExamRunBtn,
  ExamRunIcon,
  ExamRunText
} from './RunExamButton.styled'
import { ExamRunAlert } from '@components/Alerts/ExamRunAlert'

export const RunExamButton = () => {
  return (
    <ExamRunBtn
      Icon={ExamRunIcon}
      onClick={ExamRunAlert}
      text={(
        <ExamRunText>
          Run Full Test Suite
        </ExamRunText>
      )}
    />
  )
}