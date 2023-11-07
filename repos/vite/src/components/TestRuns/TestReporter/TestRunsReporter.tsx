import type { TTestRuns } from "@types"

import { useTestRuns } from "@store"
import { cls } from "@keg-hub/jsutils"
import { ETestRunsSection } from "@types"
import { TestRunFiles } from './TestRunFiles'
import { Loading } from '@gobletqa/components'
import { TestRunSectionScroll } from '../TestRuns.styled'

import { TestRunError } from '../TestRunHelpers/TestRunError'
import { NoActiveTestRun } from '../TestRunHelpers/NoActiveTestRun'
import { TestRunLoadingContainer } from './TestRunsReporter.styled'

export type TTestRunsReporter = {
  runs: TTestRuns
  active?:string
  allTestsRunning?:boolean
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

  const {
    scrollLock,
    allTestsRunning
  } = useTestRuns()
  const activeRun = runs[active as string]

  return (
    <TestRunSectionScroll
      className={cls(`test-runs-reporter-container`, scrollLock ? `locked` : `unlocked`)}
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
                ? (
                    <TestRunFiles
                      run={activeRun}
                      scrollLock={scrollLock}
                      allTestsRunning={allTestsRunning}
                    />
                  )
                : (<NoActiveTestRun onChangeSection={onChangeSection} />)
      }
    </TestRunSectionScroll>
  )
}
