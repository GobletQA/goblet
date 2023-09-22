import type {TTestRun, TTestRunEvent} from "@types"

import {testRunFileFactory} from "./testRunFileFactory"
import { findMatchingEvent } from './findMatchingEvent'


export const addEventsToTestRun = (testRun:TTestRun, events:TTestRunEvent[]) => {

  events.forEach(event => {
    testRun[event.location] = testRun[event.location] || testRunFileFactory(event)
    const file = {...testRun[event.location]}

    testRun[event.location] = {...file, events: findMatchingEvent(file.events, event) }
  })

  return testRun
}