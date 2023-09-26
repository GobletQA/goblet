import type {
  TTestRuns,
  TTestRunExecEvt,
  TTestRunExecEndEvent,
  TTestRunExecErrEvent
} from '@types'

import { useTestRuns } from '@store'
import {useEffect, useRef, useState} from 'react'
import { getEvents } from '@utils/testRuns/getEvents'
import { addTestRun } from '@actions/testRuns/addTestRun'
import { addEventsToTestRun } from '@utils/testRuns/addEventsToTestRun'
import {
  useOnEvent,
  useForceUpdate,
} from '@gobletqa/components'
import {
  TestRunErrEvt,
  TestRunExecEvt,
  TestRunExecEndEvt,
  TestRunExecCancelEvt,
} from '@constants'


export type TTestRunsReporter = {}

export const useTestRunListen = () => {

  const testRuns = useTestRuns()
  const forceUpdate = useForceUpdate()

  const [failedFiles, setFailedFiles] = useState<string[]>([])

  const [runId, setRunId] = useState<string|undefined>(testRuns.active)
  const testRunsRef = useRef<TTestRuns>({...testRuns.runs})

  useOnEvent<TTestRunExecEvt>(TestRunExecEvt, async (data) => {
    const evtRunId = data.runId
    const { events, failedLoc } = getEvents(data)
    const testRun = addEventsToTestRun(
      {...testRunsRef.current[evtRunId], runId: evtRunId},
      events
    )

    testRunsRef.current[evtRunId] = testRun

    // If there's a runId change, then update the state with the new ID
    evtRunId !== runId && setRunId(evtRunId)

    // Ensure we update the state, so we get the updates to the testRunsRef
    failedLoc
      ? setFailedFiles([...failedFiles, failedLoc])
      : forceUpdate()
  })

  useOnEvent(TestRunExecCancelEvt, () => {
    if(!runId || !testRunsRef.current[runId]) return

    testRunsRef.current[runId] = {...testRunsRef.current[runId], canceled: true}
    forceUpdate()
  })

  useOnEvent<TTestRunExecEndEvent>(TestRunExecEndEvt, (data) => {
    const { runId } = data
    const testRun = testRunsRef.current[runId]
    // Add the test run to the store after it finishes
    testRun && addTestRun({ runId, data: testRun })
  })

  useOnEvent<TTestRunExecErrEvent>(TestRunErrEvt, (data) => {
    const { runId:evtRunId, event } = data
    const testRun = testRunsRef.current[evtRunId] || { files: {}, runId: evtRunId }
    testRunsRef.current[evtRunId] = {...testRun, runError: event}

    // If the error event also created a new testRun, set it as the active test run
    evtRunId !== runId && setRunId(evtRunId)

    forceUpdate()
  })

  useEffect(() => {
    const activeEql = testRuns.active === runId
    if(testRuns.active && runId && !activeEql)
      return setRunId(testRuns.active)

    const exRuns = testRuns.runs
    const runsRef = testRunsRef.current

    if(exRuns && runsRef && exRuns !== runsRef){
      testRunsRef.current = {...exRuns}
      forceUpdate()
    }
    
  }, [
    testRuns.runs,
    testRuns.active,
  ])

  return {
    setRunId,
    failedFiles,
    active: runId,
    runs: testRunsRef.current
  }
}
