import type {
  TTestRun,
  TTestRuns,
  TTestRunExecEvt,
  TTestRunExecErrEvent
} from '@types'

import { useTestRuns } from '@store'
import {useEffect, useRef, useState} from 'react'
import { getEvents } from '@utils/testRuns/getEvents'

import { upsertTestRun } from '@actions/testRuns/upsertTestRun'
import { testRunFactory } from '@utils/testRuns/testRunFactory'
import { setTestRunActive } from '@actions/testRuns/setTestRunActive'
import { addEventsToTestRun } from '@utils/testRuns/addEventsToTestRun'
import {
  useInline,
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

const updateTestRun = (runId:string, data:TTestRun, active?:boolean) => {
  ife(async () => upsertTestRun({runId, data, active}))
}

export const useTestRunListen = () => {
  const testRuns = useTestRuns()
  const forceUpdate = useForceUpdate()

  const [runId, setLocalRunId] = useState<string|undefined>(testRuns.active)
  const testRunsRef = useRef<TTestRuns>(testRuns.runs)

  const setRunId = useInline((id?:string) => {
    setTestRunActive(id)
    setLocalRunId(id)
  })

  useOnEvent<TTestRunExecEvt>(TestRunExecEvt, async (data) => {
    const evtRunId = data.runId
    const { events } = getEvents(data)
    const tempRun = testRunFactory(testRunsRef.current[evtRunId], evtRunId)
    const testRun = addEventsToTestRun(tempRun, events)

    testRunsRef.current = {...testRunsRef.current, [evtRunId]: testRun}
    updateTestRun(evtRunId, testRun)

    // If there's a runId change, then update the state with the new ID
    evtRunId !== runId && setLocalRunId(evtRunId)
    forceUpdate()
  })

  useOnEvent(TestRunExecCancelEvt, () => {
    if(!runId || !testRunsRef.current[runId]) return

    const testRun = {...testRunsRef.current[runId], canceled: true}
    testRunsRef.current = {...testRunsRef.current, [runId]: testRun}
    updateTestRun(runId, testRun)
    forceUpdate()
  })


  useOnEvent<TTestRunExecErrEvent>(TestRunErrEvt, (data) => {
    const { runId:evtRunId, event } = data
    if(!testRunsRef.current[evtRunId]) return

    const testRun = {...(testRunsRef.current[evtRunId] || { files: {}, runId: evtRunId })}
    testRunsRef.current[evtRunId] = {...testRun, runError: event}

    updateTestRun(evtRunId, testRunsRef.current[evtRunId])
    // If the error event also created a new testRun, set it as the active test run
    evtRunId !== runId && setLocalRunId(evtRunId)
    forceUpdate()
  })

  useEffect(() => {
    // Only update externally when not currently running the test suite 
    if(testRuns.allTestsRunning) return

    const activeId = runId
    const activeEql = testRuns.active === runId
    if(testRuns.active && runId && !activeEql) return setLocalRunId(testRuns.active)

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
