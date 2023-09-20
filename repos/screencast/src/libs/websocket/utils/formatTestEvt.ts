import type { TExTestEventMeta, TExEventData, TPlayerTestEvent } from '@GSC/types'
import type { TPlayerTestEventMeta } from '@gobletqa/browser'


import { PWPlay } from '@GSC/constants'
import { filterErrMessage } from '@gobletqa/exam'
import {emptyArr} from '@keg-hub/jsutils/emptyArr'
import { capitalize } from '@keg-hub/jsutils/capitalize'
import { PWEventErrorLogFilter } from '@gobletqa/browser'


const getEventParent = (evtData:TPlayerTestEvent) => {
  if(!evtData?.id) return

  const [name, ...rest] = evtData?.id?.split(`-`)
  return name.startsWith(`spec`)
    ? `step`
    : rest.length > 1 ? `scenario` : `feature`
}

const getEventMessage = (evtData:TPlayerTestEvent) => {
  const status = evtData.action === `start`
    ? `running`
    : evtData.passed ? `passed` : `failed`

  const message = !evtData.failed || evtData.eventParent !== `step`
    ? ``
    : filterErrMessage(evtData as TExEventData, PWEventErrorLogFilter)

  return `${capitalize(evtData.eventParent)} - ${status}${message}`
}


export const formatTestEvt = (
  event:TPlayerTestEventMeta|TExTestEventMeta,
  extra?:Partial<TPlayerTestEventMeta|TExTestEventMeta>
) => {
  const data = (event.data || {}) as TPlayerTestEvent
  const parent = getEventParent(data)

  // Get the event parent, and message if they exist
  if(parent) data.eventParent = parent as any

  if(data.eventParent) data.description = getEventMessage(data)

  // Clean up the event data, we don't need the tests and describes content
  // And it can be pretty large. No point in sending it over the wire
  if(data.tests) data.tests = emptyArr
  if(data.describes) data.describes = emptyArr
  if(data.failedExpectations) delete data.failedExpectations

  if(event.name === PWPlay.playError && event.message)
    event.message = filterErrMessage(data as TExEventData, PWEventErrorLogFilter)

  return {
    ...event,
    ...extra,
    data,
    location: event.location || data?.location
  }
}