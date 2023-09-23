import { useTestRuns } from "@store"
import { TestRunFiles } from './TestRunFiles'
import { Loading } from '@gobletqa/components'
import { NoActiveTestRun } from './NoActiveTestRun'
import { useTestRunListen } from '@hooks/testRuns/useTestRunListen'
import { TestRunReporterContainer } from './TestRunsReporter.styled'

export type TTestRunsReporter = {}

const styles = {
  container: {
    width: `100%`,
    alignSelf: `center`,
  }
}

export const TestRunsReporter = (props:TTestRunsReporter) => {
  const { allTestsRunning } = useTestRuns()

  const {
    runs,
    active,
    failedFiles,
  } = useTestRunListen()

  return (
    <TestRunReporterContainer
      className='test-runs-reporter-container'
    >
      {
        active
          ? (
              <TestRunFiles
                run={runs[active]}
                failedFiles={failedFiles}
              />
            )
          : allTestsRunning
            ? (
                <Loading
                  size={30}
                  color={`primary`}
                  containerSx={styles.container}
                  message={`Test Run Starting...`}
                />
              )
            : (<NoActiveTestRun />)
      }
    </TestRunReporterContainer>
  )
}
