/**
 * **---- THIS FILE IS NOT CURRENTLY USED  ----** *
 * These methods format the events the same as how it's done on the frontend
 * At some point we may move the formatting to the backend, but I'm not sure
 * Keeping these here for now, in case that happens
 */

// import type { TExTestEventMeta } from "@gobletqa/exam"
// import type {
//   TTestRun,
//   TTestRunEvent,
//   TTestRunEvents,
//   TTestRunFileData,
//   TPlayerEventData,
// } from '@GTU/Types'

// import { emptyObj } from '@keg-hub/jsutils/emptyObj'
// import { TestsToSocketEvtMap, TestRunFileRootEvtRef } from '@GTU/Constants'
// import {
//   getText,
//   getUuid,
//   rmRootFromLoc
// } from './utils'

// export type TUITestEvt = TExTestEventMeta & {
//   id:string
//   runId:string
//   timestamp:number
// }

// export type TRunEvtFactory = {
//   rootDir?:string
//   evt?:Partial<TTestRunEvent>
// }

// export const findMatchingEvent = (events:TTestRunEvents, event:TTestRunEvent) => {
//   let found:boolean = false

//   const updated = Object.entries(events)
//     .reduce((acc, [eUUID, data]) => {
//       if(event.uuid !== eUUID){
//         acc[eUUID] = data
//         return acc
//       }

//       found = true
//       const action = event.action !== `start` ? `end` : event.action
//       acc[eUUID] = { ...data, [action]: event }
//       if(data[action as keyof typeof data]){
//         console.warn(`Found existing ${action} event in test run events`)
//         console.log(data, event)
//       }

//       // TODO: may need to investigate this for skipped and aborted actions
//       acc[eUUID] = { ...data, [action]: event }

//       return acc
//     }, {...events})

//   if(found) return updated

//   // If not found, then add the new event under it's uuid
//   updated[event.uuid] = { [event.action]: event }
//   return updated

// }


// export const addEventsToTestRun = (
//   testRun:TTestRun,
//   events:TTestRunEvent[]
// ) => {

//   events.forEach(event => {
//     testRun.files = testRun.files || {}
//     testRun.files[event.location] = testRun?.files?.[event.location]
//       || testRunFileFactory(event)

//     const file = {...testRun?.files?.[event.location]}

//     testRun.files[event.location] = {...file, events: findMatchingEvent(file.events, event) }
//   })

//   return testRun
// }


// export const testRunFileFactory = (event:TTestRunEvent, trFile?:Partial<TTestRunFileData>) => {
//   return {
//     events: {},
//     runId: event.runId,
//     stats: event.stats,
//     status: event.status,
//     failed: event.failed,
//     passed: event.passed,
//     location: event.location,
//     timestamp: event.timestamp,
//     ...trFile
//   } as TTestRunFileData
// }

// export const testEvtFactory = (
//   evt:TUITestEvt,
//   opts:TRunEvtFactory=emptyObj as TRunEvtFactory
// ) => {
  
//   const {
//     rootDir
//   } = opts

//   const {
//     id,
//     name,
//     runId,
//     message,
//     data={} as TPlayerEventData,
//   } = evt

//   const {
//     type,
//     stats,
//     status,
//     action,
//     failed,
//     passed,
//     skipped,
//     timestamp,
//     location,
//     metaData={},
//     description,
//   } = data

//   const uuid = name === TestsToSocketEvtMap.results || name === TestsToSocketEvtMap.started
//     ? TestRunFileRootEvtRef
//     : name === TestsToSocketEvtMap.error
//       ? `${type}-${runId}`
//       : metaData?.uuid || getUuid(evt)

//   return {
//     id,
//     uuid,
//     type,
//     stats,
//     runId,
//     action,
//     failed,
//     passed,
//     skipped,
//     text: getText(evt),
//     description: description || message,
//     timestamp: timestamp || evt.timestamp,
//     location: rmRootFromLoc(location || evt.location, rootDir),
//     metaType: uuid === TestRunFileRootEvtRef ? `file` : metaData.type,
//     status: status || failed && `failed` || passed && `passed` || `unknown`,
//     ...opts.evt,
//   } as TTestRunEvent
// }

export {}