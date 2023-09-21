import {
  ExamRunBtn,
  ExamRunIcon,
  ExamRunText
} from './RunExamButton.styled'
import { toggleExamView } from '@actions/exam/toggleExamView'

export const RunExamButton = () => {
  return (
    <ExamRunBtn
      Icon={ExamRunIcon}
      onClick={() => toggleExamView()}
      text={(
        <ExamRunText>
          Run Test Suite
        </ExamRunText>
      )}
    />
  )
}