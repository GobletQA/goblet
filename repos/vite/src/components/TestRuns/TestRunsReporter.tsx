import type { TOnTestRunEvent, TTestRuns, TAddActiveTestRunEvts } from '@types'

import { useApp } from "@store"
import { NoActiveTestRun } from './NoActiveTestRun'
import { TestRunFileEvents } from './TestRunFileEvents'
import { TestRunReporterContainer } from './TestRuns.styled'
import { addEventsToTestRun } from '@utils/testRuns/addEventsToTestRun'

import {useRef, useState} from 'react'
import { OnTestRunEvt } from '@constants'
import {
  Loading,
  useOnEvent,
  useForceUpdate,
} from '@gobletqa/components'

export type TTestRunsReporter = {}


const getEvents = (opts:TAddActiveTestRunEvts) => {
  const { events=[], event } = opts
  return !event || events.find(evt => evt?.timestamp ===  event?.timestamp)
    ? events
    : [...events, event]
}

const useTestRunListen = () => {
  
  const testRunsRef = useRef<TTestRuns>({})
  const forceUpdate = useForceUpdate()
  const [runId, setRunId] = useState<string>()

  useOnEvent<TOnTestRunEvent>(OnTestRunEvt, async (data) => {
    const evtRunId = data.runId
    const events = getEvents(data)
    const testRun = addEventsToTestRun({...testRunsRef.current[evtRunId]}, events)
    testRunsRef.current[evtRunId] = testRun

    // If there's a runId change, then update the state with the new ID
    evtRunId !== runId && setRunId(evtRunId)

    // Force update so we get the updates to the ref
    forceUpdate()

  })
  
  return {
    active: runId,
    runs: testRunsRef.current
  }
}

const styles = {
  container: {
    width: `100%`,
    alignSelf: `center`,
  }
}

export const TestRunsReporter = (props:TTestRunsReporter) => {
  const { allTestsRunning } = useApp()

  const {
    runs,
    active,
  } = useTestRunListen()

  return (
    <TestRunReporterContainer
      className='test-runs-reporter-container'
    >
      {
        active
          ? (<TestRunFileEvents run={runs[active]} />)
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
