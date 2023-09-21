import type { TTestRunFileData, TTestRunEvent} from "@types"


export const shouldAddEventToFile = (trFile:TTestRunFileData, event:TTestRunEvent) => {
  if(trFile.location !== event.location) return false
  if(trFile.events.find(evt => evt?.timestamp ===  event?.timestamp)) return false

  return true
}