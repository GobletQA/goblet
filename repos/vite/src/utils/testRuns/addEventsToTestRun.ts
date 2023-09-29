import type {TTestRun, TTestRunEvent} from "@types"

import {testRunFileFactory} from "./testRunFileFactory"
import { findMatchingEvent } from './findMatchingEvent'
import { updateTestRunStats } from './updateTestRunStats'

const addEvt = (
  testRun:TTestRun,
  event:TTestRunEvent
) => {
  const exists = testRun?.files?.[event.location]
  const file = exists ? {...exists} : testRunFileFactory(event)

  testRun.files[event.location] = {
    ...file,
    events: findMatchingEvent({...file.events}, event)
  }
}

export const addEventsToTestRun = (
  testRun:TTestRun,
  events:TTestRunEvent[]
) => {

  const tRun = {...testRun}
  tRun.files = {...tRun.files}

  events.forEach(event => {
    addEvt(tRun, event)
    updateTestRunStats(tRun, event)
  })

  return tRun
}
