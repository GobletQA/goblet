import type { TTestRun, TTestRunEventState, TTestRunFileData } from '@types'

import { TestRunEvent } from './TestRunEvent'
import { TestRunFileRootEvtRef } from '@constants'
import { TestRunEventsContainer } from './TestRunsReporter.styled'

export type TTestRunFileEvents = {
  run:TTestRun
}

export type TTestRunEvents = {
  canceled?:boolean
  scrollLock?:boolean
  file:TTestRunFileData
  allTestsRunning?:boolean
  runState:TTestRunEventState
}

export const TestRunEvents = (props:TTestRunEvents) => {
  const {
    file,
    runState,
    canceled,
    scrollLock,
    allTestsRunning,
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
                  runState={runState}
                  start={events.start}
                  canceled={canceled}
                  scrollLock={scrollLock}
                  allTestsRunning={allTestsRunning}
                />
              ) || null
          })
      }
    </TestRunEventsContainer>
  )
  
}
