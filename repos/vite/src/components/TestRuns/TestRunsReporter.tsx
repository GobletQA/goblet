import type { TTestRuns } from "@types"

import { useTestRuns } from "@store"
import { ETestRunsSection } from "@types"
import { TestRunError } from './TestRunError'
import { TestRunFiles } from './TestRunFiles'
import { Loading } from '@gobletqa/components'
import { NoActiveTestRun } from './NoActiveTestRun'
import { TestRunLoadingContainer, TestRunReporterContainer } from './TestRunsReporter.styled'

export type TTestRunsReporter = {
  runs: TTestRuns
  active?:string
  onChangeSection:(section:ETestRunsSection) => void
}

const styles = {
  container: {
    width: `100%`,
    alignSelf: `center`,
  }
}

export const TestRunsReporter = (props:TTestRunsReporter) => {  
  const {
    runs,
    active,
    onChangeSection
  } = props

  const { allTestsRunning } = useTestRuns()
  const activeRun = runs[active as string]

  return (
    <TestRunReporterContainer
      className='test-runs-reporter-container'
    >
      {
        allTestsRunning && !activeRun
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
          : activeRun?.runError
            ? <TestRunError run={activeRun} />
              : activeRun
                ? (<TestRunFiles run={activeRun} />)
                : (<NoActiveTestRun onChangeSection={onChangeSection} />)
      }
    </TestRunReporterContainer>
  )
}
