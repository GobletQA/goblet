import type { EResultAction } from '@ltipton/parkin'
import type { TPlayerTestEventMeta } from '@gobletqa/browser'
import type { TExTestEventMeta, TExEventData, TPlayerTestEvent } from '@GSC/types'


import { TestsToSocketEvtMap } from '@GSC/constants'
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

  return `${capitalize(evtData.eventParent)} - ${status}\n${message}`
}

/**
  * TODO: Remove this when parkin-test is fixed
 * This is a hack in place to fix a bug in parkin
 * When a scenario end event is fired, but no steps were run,
 * Then the events action is set to start for some reason
 */
const getEvtStatus = (evtData:TPlayerTestEvent) => {
  if(!evtData?.id || evtData.action !== `start`) return evtData

  if(evtData.status && evtData.action === `start` && (evtData.passed || evtData.failed)){
    evtData.action = `end` as EResultAction
    evtData.status = evtData.passed ? `passed` : `failed`
  }

  return evtData
}

export const formatTestEvt = (
  event:Partial<TPlayerTestEventMeta|TExTestEventMeta>,
  extra?:Partial<TPlayerTestEventMeta|TExTestEventMeta>
) => {

  const data = getEvtStatus((event.data || {}) as TPlayerTestEvent)

  const parent = getEventParent(data)

  // Get the event parent, and message if they exist
  if(parent) data.eventParent = parent as any

  if(data.eventParent) data.description = getEventMessage(data)

  // Clean up the event data, we don't need the tests and describes content
  // And it can be pretty large. No point in sending it over the wire
  if(data.tests) data.tests = emptyArr
  if(data.describes) data.describes = emptyArr
  if(data.failedExpectations) delete data.failedExpectations

  // TODO: validate if this should be `event.message` || `!event.message`
  // Pretty sure it should be `!event.message`
  // If so, we would not need the extra `data.testPath !== `/`` check
  if(event.name === TestsToSocketEvtMap.error && event.message && data.testPath !== `/`)
    event.message = filterErrMessage(data as TExEventData, PWEventErrorLogFilter)

  const loc = event.location || data?.location
  if(loc){
    event.location = loc
    data.location = loc
  }

  return {
    ...event,
    ...extra,
    data,
  }
}