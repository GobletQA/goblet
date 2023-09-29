import type {
  TTestRuns,
  TTestRunExecEvt,
  TTestRunExecErrEvent
} from '@types'

import { useTestRuns } from '@store'
import {useEffect, useRef, useState} from 'react'
import { getEvents } from '@utils/testRuns/getEvents'

import { upsertTestRun } from '@actions/testRuns/upsertTestRun'
import { testRunFactory } from '@utils/testRuns/testRunFactory'
import { addEventsToTestRun } from '@utils/testRuns/addEventsToTestRun'
import {
  useOnEvent,
  useForceUpdate,
} from '@gobletqa/components'
import {
  TestRunErrEvt,
  TestRunExecEvt,
  TestRunExecCancelEvt,
} from '@constants'
import {ife} from '@keg-hub/jsutils'


export type TTestRunsReporter = {}

export const useTestRunListen = () => {
  const testRuns = useTestRuns()
  const forceUpdate = useForceUpdate()

  const [runId, setRunId] = useState<string|undefined>(testRuns.active)
  const testRunsRef = useRef<TTestRuns>(testRuns.runs)

  useOnEvent<TTestRunExecEvt>(TestRunExecEvt, async (data) => {
    const evtRunId = data.runId
    const { events } = getEvents(data)
    const tempRun = testRunFactory(testRunsRef.current[evtRunId], evtRunId)
    const testRun = addEventsToTestRun(tempRun, events)

    testRunsRef.current = {...testRunsRef.current, [evtRunId]: testRun}

    ife(async () => upsertTestRun({ runId: evtRunId, data: testRun }))
    // If there's a runId change, then update the state with the new ID
    evtRunId !== runId && setRunId(evtRunId)
    forceUpdate()
  })

  useOnEvent(TestRunExecCancelEvt, () => {
    if(!runId || !testRunsRef.current[runId]) return

    const testRun = {...testRunsRef.current[runId], canceled: true}
    testRunsRef.current = {...testRunsRef.current, [runId]: testRun}
    ife(async () => upsertTestRun({ runId, data: testRun }))
    forceUpdate()
  })


  useOnEvent<TTestRunExecErrEvent>(TestRunErrEvt, (data) => {
    const { runId:evtRunId, event } = data
    if(!testRunsRef.current[evtRunId]) return

    const testRun = {...(testRunsRef.current[evtRunId] || { files: {}, runId: evtRunId })}
    testRunsRef.current[evtRunId] = {...testRun, runError: event}

    ife(async () => upsertTestRun({ runId: evtRunId, data: testRunsRef.current[evtRunId] }))
    // If the error event also created a new testRun, set it as the active test run
    evtRunId !== runId && setRunId(evtRunId)
    forceUpdate()
  })

  useEffect(() => {
    // Only update externally when not currently running the test suite 
    if(testRuns.allTestsRunning) return

    const activeId = runId
    const activeEql = testRuns.active === runId
    if(testRuns.active && runId && !activeEql) return setRunId(testRuns.active)

    const exRuns = testRuns.runs
    const runsRef = testRunsRef.current

    if(exRuns && runsRef && exRuns !== runsRef){
      testRunsRef.current = exRuns
      forceUpdate()
    }
    
    return () => {
      if(!activeId) return

      const testRun = testRunsRef.current[activeId]
      if(!testRun || testRun?.canceled || testRun?.runError || testRun?.finished) return

      // Add the test run to the store after it finishes
      testRun && upsertTestRun({ runId: activeId, data: testRun })
    }
  }, [
    testRuns.runs,
    testRuns.active,
    testRuns.allTestsRunning,
  ])

  return {
    setRunId,
    active: runId,
    runs: testRunsRef.current,
    allTestsRunning: testRuns.allTestsRunning
  }
}
