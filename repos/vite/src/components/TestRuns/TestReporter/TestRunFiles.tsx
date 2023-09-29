import type { TPlayerResEvent, TTestRun, TTestRunFileData } from '@types'

import { useState } from 'react'
import { cls } from '@keg-hub/jsutils'
import { TestRunEvents } from './TestRunEvents'
import { TestRunFileRootEvtRef } from '@constants'
import { TestRunOverview } from './TestRunOverview'
import { TestRunDeco } from '../TestRunHelpers/TestRunDeco'
import { useEventState } from '@hooks/testRuns/useEventState'

import {
  TestRunEventsList,
  TestRunSectionHeader,
  TestRunSectionHeaderTitle,
  TestRunFileContainer,
  TestRunListHeaderText,
  TestRunEventsDropdown,
  TestRunEventsListHeader,
  TestRunEventsListHeaderContainer,
} from './TestRunsReporter.styled'

export type TTestRunFileEvents = {
  run:TTestRun
  allTestsRunning?:boolean
}

export type TTestRunFile = {
  location:string
  canceled?:boolean
  file:TTestRunFileData
  allTestsRunning?:boolean
}

const TestRunFile = (props:TTestRunFile) => {
  const {
    file,
    location,
    canceled,
    allTestsRunning
  } = props

  const [open, setOpen] = useState(true)
  const onClick = () => setOpen(!open)
  const runState = useEventState(
    file?.events[TestRunFileRootEvtRef],
    canceled
  )

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
        <TestRunEvents
          file={file}
          runState={runState}
          canceled={canceled}
          allTestsRunning={allTestsRunning}
        />
      </TestRunEventsDropdown>
    </TestRunEventsList>
  )

}

export const TestRunFiles = (props:TTestRunFileEvents) => {
  const { run, allTestsRunning } = props

  return (
    <>
      <TestRunOverview run={run} />

      <TestRunSectionHeader>
        <TestRunSectionHeaderTitle>
          Results
        </TestRunSectionHeaderTitle>
      </TestRunSectionHeader>

      {
        Object.entries(run?.files).map(([location, file]) => {
          return (
            <TestRunFileContainer
              key={location}
              className='test-run-events-file-container'
            >
              <TestRunFile
                file={file}
                location={location}
                canceled={run.canceled}
                allTestsRunning={allTestsRunning}
              />
            </TestRunFileContainer>
          )
        })
      }
    </>
  )
}

