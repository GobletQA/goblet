import type {TTestRun, TTestRunEvent} from "@types"

import { ETREvtType } from "@types"
import {getTREventType} from "./getTREventType"

export const updateTestRunStats = (
  testRun:TTestRun,
  event:TTestRunEvent
) => {
  
  if(event.action === `start`) return

  const stats = {
    passed: {...testRun.stats.passed},
    failed: {...testRun.stats.failed},
    skipped: {...testRun.stats.skipped},
  }

  const file = testRun.files[event.location]

  switch(getTREventType(event)){
    case ETREvtType.file: {
      testRun.files[event.location] = {
        ...file,
        status: event.status,
        failed: event.failed,
        passed: event.passed,
      }
      break
    }
    case ETREvtType.feature: {
      event.passed
        ? stats.passed.features = stats.passed.features + 1
        : stats.failed.features = stats.failed.features + 1
      break
    }
    case ETREvtType.parent: {
      event.passed
        ? stats.passed.parents = stats.passed.parents + 1
        : stats.failed.parents = stats.failed.parents + 1
      break
    }
    case ETREvtType.step: {
      event.passed
        ? stats.passed.steps = stats.passed.steps + 1
        : stats.failed.steps = stats.failed.steps + 1
      break
    }
  }

  testRun.stats = stats
}