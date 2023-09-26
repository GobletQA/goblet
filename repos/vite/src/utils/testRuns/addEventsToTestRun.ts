import type {TTestRun, TTestRunEvent} from "@types"

import {testRunFileFactory} from "./testRunFileFactory"
import { findMatchingEvent } from './findMatchingEvent'


export const addEventsToTestRun = (
  testRun:TTestRun,
  events:TTestRunEvent[]
) => {

  events.forEach(event => {
    testRun.files = testRun.files || {}
    testRun.files[event.location] = testRun?.files?.[event.location]
      || testRunFileFactory(event)

    const file = {...testRun?.files?.[event.location]}

    testRun.files[event.location] = {...file, events: findMatchingEvent(file.events, event) }
  })

  return testRun
}
