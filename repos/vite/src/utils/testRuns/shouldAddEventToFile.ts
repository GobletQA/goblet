import type { TTestRunFileData, TTestRunEvent} from "@types"


export const shouldAddEventToFile = (trFile:TTestRunFileData, event:TTestRunEvent) => {
  if(trFile.location !== event.location) return false

  const foundMatch = Object.entries(trFile.events).find(([key, evt]) => {
    if(key !== event.uuid) return false

    if(evt?.start && evt.start?.id === event?.id) return true
    if(evt?.end && evt.end?.id === event?.id) return true
  })

  return foundMatch ? false : true

}