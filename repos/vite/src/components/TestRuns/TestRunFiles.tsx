import type { TPlayerResEvent, TTestRun, TTestRunFileData } from '@types'

import { useState } from 'react'
import { cls } from '@keg-hub/jsutils'
import { TestRunDeco } from './TestRunDeco'
import { TestRunEvents } from './TestRunEvents'
import { TestRunFileRootEvtRef } from '@constants'
import { useEventState } from '@hooks/testRuns/useEventState'

import {
  TestRunEventsList,
  TestRunFileContainer,
  TestRunListHeaderText,
  TestRunEventsDropdown,
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
  const runState = useEventState(file?.events[TestRunFileRootEvtRef])

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
            <TestRunDeco
              status={runState.status}
              className='gb-test-run-file-deco'
            />
            <TestRunListHeaderText>
              {location}
            </TestRunListHeaderText>
          </TestRunEventsListHeaderContainer>
        </TestRunEventsListHeader>
      )}
    >
      <TestRunEventsDropdown
        in={open}
        unmountOnExit
        timeout="auto"
      >
        <TestRunEvents file={file} />
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
            <TestRunFileContainer
              key={location}
              className='test-run-events-file-container'
            >
              <TestRunFile
                file={file}
                location={location}
              />
            </TestRunFileContainer>
          )
        })
      }
    </>
  )
}

