import {TestRunFileRootEvtRef} from '@constants'
import {cls} from '@keg-hub/jsutils'
import type { TPlayerResEvent, TTestRun, TTestRunFileData } from '@types'

import { useMemo, useState } from 'react'
import { TestRunDeco } from './TestRunDeco'
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
  run:TTestRun
}

export type TTestRunFile = {
  location:string
  file:TTestRunFileData
}

const useFileRunState = (file:TTestRunFileData) => {
  const rootEvt = file?.events[TestRunFileRootEvtRef]
  return useMemo(() => {
    if(!rootEvt?.start)
      return {}
    
    return !rootEvt?.end
      ? {
          status: `running`,
          stats: rootEvt?.start?.stats,
          className: `gb-test-runs-line running`
        }
      : {
          stats: rootEvt?.end?.stats,
          status: rootEvt?.end?.status,
          className: `gb-test-runs-line ${rootEvt?.end?.status}`
        }
    
  }, [
    rootEvt?.end,
    rootEvt?.start,
  ])
  
}

const TestRunFile = (props:TTestRunFile) => {
  const {
    file,
    location,
  } = props


  const [open, setOpen] = useState(true)
  const onClick = () => setOpen(!open)

  const fileState = useFileRunState(file)
  const { start, end } = file?.events[TestRunFileRootEvtRef]

  return (
    <TestRunEventsList
      className={`test-run-events-file-list`}
      subheader={
        <TestRunEventsListHeader
          onClick={onClick}
          className={cls(
            fileState.className,
            `test-run-events-file-list-header`,
          )}
        >
          <TestRunDeco status={fileState.status as any} />
          {location}
        </TestRunEventsListHeader>
      }
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

export const TestRunFileEvents = (props:TTestRunFileEvents) => {
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

