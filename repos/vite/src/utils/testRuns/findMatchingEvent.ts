import type { TTestRunEvent, TTestRunEvents} from "@types"


export const findMatchingEvent = (events:TTestRunEvents, event:TTestRunEvent) => {
  let found:boolean = false

  const updated = Object.entries(events)
    .reduce((acc, [eUUID, data]) => {
      if(event.uuid !== eUUID){
        acc[eUUID] = data
        return acc
      }

      found = true
      const action = event.action !== `start` ? `end` : event.action
      acc[eUUID] = { ...data, [action]: event }
      if(data[action as keyof typeof data]){
        console.warn(`Found existing ${action} event in test run events`)
        console.log(data, event)
      }

      // TODO: may need to investigate this for skipped and aborted actions
      acc[eUUID] = { ...data, [action]: event }

      return acc
    }, {...events})

  if(found) return updated

  // If not found, then add the new event under it's uuid
  updated[event.uuid] = { [event.action]: event }
  return updated

}
