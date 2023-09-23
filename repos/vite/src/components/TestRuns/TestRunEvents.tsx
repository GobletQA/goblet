import type { TTestRun, TTestRunEventState, TTestRunFileData } from '@types'

import { TestRunEvent } from './TestRunEvent'
import { TestRunFileRootEvtRef } from '@constants'
import { TestRunEventsContainer } from './TestRunsReporter.styled'

export type TTestRunFileEvents = {
  run:TTestRun
}

export type TTestRunEvents = {
  file:TTestRunFileData
  runState:TTestRunEventState
}

export const TestRunEvents = (props:TTestRunEvents) => {
  const {
    file,
    runState
  } = props

  return (
    <TestRunEventsContainer>
      {
        Object.entries(file.events)
          .map(([uuid, events]) => {
            return events.start
              && events.start?.uuid !== TestRunFileRootEvtRef
              && (
                <TestRunEvent
                  key={uuid}
                  end={events.end}
                  start={events.start}
                  runState={runState}
                />
              ) || null
          })
      }
    </TestRunEventsContainer>
  )
  
}
