import { runExam } from '@actions/exam/runExam'
import {
  ExamRunBtn,
  ExamRunIcon,
  ExamRunText
} from './RunExamButton.styled'


export const RunExamButton = () => {
  return (
    <ExamRunBtn
      Icon={ExamRunIcon}
      onClick={() => runExam()}
      text={(
        <ExamRunText>
          Run Exam
        </ExamRunText>
      )}
    />
  )
}