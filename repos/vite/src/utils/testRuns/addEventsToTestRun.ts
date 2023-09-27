import type {TTestRun, TTestRunEvent} from "@types"

import {testRunFileFactory} from "./testRunFileFactory"
import { findMatchingEvent } from './findMatchingEvent'


export const addEventsToTestRun = (
  testRun:TTestRun,
  events:TTestRunEvent[]
) => {

  const tRun = {...testRun}

  events.forEach(event => {
    tRun.files = {...tRun.files}
    const exists = tRun?.files?.[event.location]
    const file = exists ? {...exists} : testRunFileFactory(event)

    tRun.files[event.location] = {...file, events: findMatchingEvent({...file.events}, event) }
  })

  return tRun
}
