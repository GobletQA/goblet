import type {
  TTestRuns,
  TTestRunExecEvt,
  TTestRunExecEndEvent,
  TAddActiveTestRunEvts
} from '@types'

import {useRef, useState} from 'react'
import { getEvents } from '@utils/testRuns/getEvents'
import { addTestRun } from '@actions/testRuns/addTestRun'
import { TestRunExecEvt, TestRunExecEndEvt } from '@constants'
import { addEventsToTestRun } from '@utils/testRuns/addEventsToTestRun'
import {
  useOnEvent,
  useForceUpdate,
} from '@gobletqa/components'

/**
 * **IMPORTANT** - Only include this for testing
 * It should not be included in production builds
 */
import { runMock } from '@services/__mocks__/testrun.mock'

export type TTestRunsReporter = {}

export const useTestRunListen = () => {

  const forceUpdate = useForceUpdate()

  const [failedFiles, setFailedFiles] = useState<string[]>([])
  
  // const [runId, setRunId] = useState<string>(`runMock`)
  // const testRunsRef = useRef<TTestRuns>(runMock as TTestRuns)

  const [runId, setRunId] = useState<string>()
  const testRunsRef = useRef<TTestRuns>({} as TTestRuns)

  useOnEvent<TTestRunExecEvt>(TestRunExecEvt, async (data) => {
    const evtRunId = data.runId
    const { events, failedLoc } = getEvents(data)
    const testRun = addEventsToTestRun({...testRunsRef.current[evtRunId]}, events)
    testRunsRef.current[evtRunId] = testRun

    // If there's a runId change, then update the state with the new ID
    evtRunId !== runId && setRunId(evtRunId)

    // Ensure we update the state, so we get the updates to the testRunsRef
    failedLoc
      ? setFailedFiles([...failedFiles, failedLoc])
      : forceUpdate()

  })


  useOnEvent<TTestRunExecEndEvent>(TestRunExecEndEvt, (data) => {
    const { runId } = data
    const testRun = testRunsRef.current[runId]
    // Add the test run to the store after it finishes
    testRun && addTestRun({ runId, data: testRun })
  })

  return {
    failedFiles,
    active: runId,
    runs: testRunsRef.current
  }
}
