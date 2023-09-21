import type {TTestRun, TTestRunEvent} from "@types"

import {testRunFileFactory} from "./testRunFileFactory"
import {shouldAddEventToFile} from "./shouldAddEventToFile"

export const addEventsToTestRun = (testRun:TTestRun, events:TTestRunEvent[]) => {
  events.forEach(event => {
    const loc = event.location
    testRun[event.location] = testRun[event.location] || testRunFileFactory(event)
    const file = testRun[event.location]
    if(!shouldAddEventToFile(file, event)) return

    testRun[event.location] = {...file, events: [...file.events, event]}
  })

  return testRun
}