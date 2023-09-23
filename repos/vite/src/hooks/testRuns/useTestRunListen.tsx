import type { TOnTestRunEvent, TTestRuns, TAddActiveTestRunEvts } from '@types'

import {useRef, useState} from 'react'
import { OnTestRunEvt } from '@constants'
import { addEventsToTestRun } from '@utils/testRuns/addEventsToTestRun'
import {
  useOnEvent,
  useForceUpdate,
} from '@gobletqa/components'


import { runMock } from '@services/__mocks__/testrun.mock'

export type TTestRunsReporter = {}

const getEvents = (opts:TAddActiveTestRunEvts) => {
  const { events=[], event } = opts
  const evts = !event || events.find(evt => evt?.timestamp ===  event?.timestamp)
    ? events
    : [...events, event]

  const failedEvt = evts.find(evt => evt.status === `failed`)

  return { events: evts, failedLoc: failedEvt?.location }
}

export const useTestRunListen = () => {

  const forceUpdate = useForceUpdate()

  const [failedFiles, setFailedFiles] = useState<string[]>([])
  
  // const [runId, setRunId] = useState<string>(`runMock`)
  // const testRunsRef = useRef<TTestRuns>(runMock as TTestRuns)

  const [runId, setRunId] = useState<string>()
  const testRunsRef = useRef<TTestRuns>({} as TTestRuns)

  useOnEvent<TOnTestRunEvent>(OnTestRunEvt, async (data) => {
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
  
  return {
    failedFiles,
    active: runId,
    runs: testRunsRef.current
  }
}
