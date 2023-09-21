import type { TPlayerResEvent } from '@types'

import { useState } from 'react'
import { TestRunEvent } from './TestRunEvent'

import {
  TestRunEventsList,
  TestRunEventsDropdown,
  TestRunEventsContainer,
  TestRunEventsListHeader,
} from './TestRunEvents.styled'

export type TTestRunEvents = {
  name:string
  events:TPlayerResEvent[]
}

export type TTestRunFileEvents = {
  location:string
  status:string
  events:TPlayerResEvent[]
}

export const TestRunFileEvents = (props:TTestRunFileEvents) => {
  const {
    status,
    location,
    events,
  } = props

  const [open, setOpen] = useState(true)
  const onClick = () => setOpen(!open)

  return (
    <TestRunEventsContainer className='test-run-events-file-container' >
      <TestRunEventsDropdown onClick={onClick} >
          <TestRunEventsList
            className='test-run-events-file-list'
            subheader={
              <TestRunEventsListHeader className='test-run-events-file-list-header' >
                {status} {location}
              </TestRunEventsListHeader>
            }
          >
          {
            events.map(event => {
              return (
                <TestRunEvent
                  {...event}
                />
              )
            })
          }
        </TestRunEventsList>
      </TestRunEventsDropdown>
    </TestRunEventsContainer>
  )
  
}

