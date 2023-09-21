import type { TRunResultActionMeta, EResultAction } from '@ltipton/parkin'
import type { TExRunResult, EPlayerTestAction, EPlayerTestType, TPlayerResEvent } from '@types'

import { useMemo } from 'react'
import { TestRunFileEvents } from './TestRunFileEvents'

import {
  TestRunEventsList,
  TestRunEventsContainer,
  TestRunEventsListHeader,
} from './TestRunEvents.styled'

export type TTestRunEvents = {
  name:string
  events:TPlayerResEvent[]
}

export type TTRListItem = {
  id:string
  text?:string
  runId:string
  uuid?:string
  status?:string
  failed?:boolean
  passed?:boolean
  skipped?:boolean
  timestamp:number
  description:string
  type:EPlayerTestType
  action:EPlayerTestAction|EResultAction
}

const useMapTestRunEvents = (props:TTestRunEvents) => {
  const {
    name,
    events,
  } = props

  // TODO split the events up by file location
  // Then match the events based on their metaData.uuid
  // Most of the time there should be 2 events with the same metaData.uuid
  // One for the start, and one for end
  // Need to track what events have a start, then update when it's end event comes in

  return useMemo(() => {
    return events.reduce((acc, evt) => {
      const { runId, data, location } = evt
      const {
        id,
        type,
        failed,
        passed,
        status,
        action,
        skipped,
        timestamp,
        description,
        metaData={} as TRunResultActionMeta,
      } = data as TExRunResult

      const {
        uuid,
        step,
        feature,
        scenario,
      } = metaData

      acc.push({
        id,
        runId,
        action,
        failed,
        passed,
        skipped,
        timestamp,
        description,
        uuid: uuid || location,
        type: metaData?.type || type,
        text: step || scenario || feature,
        status: status || failed && `failed` || passed && `passed` || `unknown`,
      } as TTRListItem)

      return acc
    }, [] as TTRListItem[])
    
    
  }, [name, events])
  
}

export const TestRunEvents = (props:TTestRunEvents) => {
  const {
    name,
    events,
  } = props

  const mapped = useMapTestRunEvents(props)
  console.log(`------- name -------`)
  console.log(name)
  console.log(`------- events -------`)
  console.log(events)

  return (
    <TestRunEventsContainer className='test-run-events-container' >
      <TestRunEventsList
        className='test-run-events-list'
        subheader={
          <TestRunEventsListHeader className='test-run-events-list-header' >
            {name}
          </TestRunEventsListHeader>
        }
      >
      {
        mapped.map(file => {
          return (
            <TestRunFileEvents
              {...file}
            />
          )
        })
      }
      </TestRunEventsList>
    </TestRunEventsContainer>
  )
  
}

