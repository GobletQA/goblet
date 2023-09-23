import type { TPlayerResEvent, TTestRun, TTestRunFileData } from '@types'

import { cls } from '@keg-hub/jsutils'
import { useState } from 'react'
import { TestRunDeco } from './TestRunDeco'
import { TestRunEvent } from './TestRunEvent'
import { useTestRunState } from '@hooks/testRuns/useTestRunState'

import {
  TestRunEventsList,
  TestRunListHeaderText,
  TestRunEventsDropdown,
  TestRunEventsContainer,
  TestRunEventsListHeader,
  TestRunEventsListHeaderContainer,
} from './TestRunsReporter.styled'

export type TTestRunEvents = {
  name:string
  events:TPlayerResEvent[]
}

export type TTestRunFileEvents = {
  run:TTestRun
}

export type TTestRunFile = {
  location:string
  file:TTestRunFileData
}

const TestRunFile = (props:TTestRunFile) => {
  const {
    file,
    location,
  } = props


  const [open, setOpen] = useState(true)
  const onClick = () => setOpen(!open)
  const runState = useTestRunState(file)

  return (
    <TestRunEventsList
      className={`test-run-events-file-list`}
      subheader={(
        <TestRunEventsListHeader
          onClick={onClick}
          className={cls(
            `test-run-events-file-list-header-container`
          )}
        >
          <TestRunEventsListHeaderContainer className={cls(
            runState.className,
            `test-run-events-file-list-header`,
          )}>
            <TestRunDeco status={runState.status as any} />
            <TestRunListHeaderText>
              {location}
            </TestRunListHeaderText>
          </TestRunEventsListHeaderContainer>
        </TestRunEventsListHeader>
      )}
    >
      <TestRunEventsDropdown
        in={open}
        timeout="auto"
        unmountOnExit
      >
          {
            Object.entries(file.events).map(([uuid, events]) => {
              return events.start && (
                <TestRunEvent
                  key={uuid}
                  end={events.end}
                  start={events.start}
                />
              ) || null
            })
          }
      </TestRunEventsDropdown>
    </TestRunEventsList>
  )
  
}

export const TestRunFiles = (props:TTestRunFileEvents) => {
  const { run } = props

  return (
    <>
      {
        Object.entries(run).map(([location, file]) => {
          return (
            <TestRunEventsContainer
              key={location}
              className='test-run-events-file-container'
            >
              <TestRunFile
                file={file}
                location={location}
              />
            </TestRunEventsContainer>
          )
        })
      }
    </>
  )
}

