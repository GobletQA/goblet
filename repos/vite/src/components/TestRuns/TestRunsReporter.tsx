import { useTestRuns } from "@store"
import { ETestRunsSection } from "@types"
import { TestRunError } from './TestRunError'
import { TestRunFiles } from './TestRunFiles'
import { Loading } from '@gobletqa/components'
import { NoActiveTestRun } from './NoActiveTestRun'
import { useTestRunListen } from '@hooks/testRuns/useTestRunListen'
import { TestRunLoadingContainer, TestRunReporterContainer } from './TestRunsReporter.styled'

export type TTestRunsReporter = {
  onChangeSection:(section:ETestRunsSection) => void
}

const styles = {
  container: {
    width: `100%`,
    alignSelf: `center`,
  }
}

export const TestRunsReporter = (props:TTestRunsReporter) => {
  const { onChangeSection } = props
  const { allTestsRunning } = useTestRuns()

  const {
    runs,
    active,
    failedFiles,
  } = useTestRunListen()

  const activeRun = runs[active as string]

  return (
    <TestRunReporterContainer
      className='test-runs-reporter-container'
    >
      {
        activeRun?.runError
          ? <TestRunError run={activeRun} />
          : activeRun
            ? (
                <TestRunFiles
                  run={activeRun}
                  failedFiles={failedFiles}
                />
              )
            : allTestsRunning
              ? (
                  <TestRunLoadingContainer>
                    <Loading
                      size={30}
                      color={`primary`}
                      containerSx={styles.container}
                      message={`Test Run Starting...`}
                    />
                  </TestRunLoadingContainer>
                )
              : (<NoActiveTestRun onChangeSection={onChangeSection} />)
      }
    </TestRunReporterContainer>
  )
}
