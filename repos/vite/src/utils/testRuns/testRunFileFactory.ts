import type { TTestRunFileData, TTestRunEvent} from "@types"


export const testRunFileFactory = (event:TTestRunEvent, trFile?:Partial<TTestRunFileData>) => {
  return {
    events: [event],
    runId: event.runId,
    stats: event.stats,
    status: event.status,
    failed: event.failed,
    passed: event.passed,
    location: event.location,
    timestamp: event.timestamp,
    ...trFile
  } as TTestRunFileData
}
