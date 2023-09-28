import {cls, wordCaps} from '@keg-hub/jsutils'
import type { TTestRunEvent, TTestRunEventState } from '@types'

import { useMemo } from 'react'
import { TestRunDeco } from '../TestRunHelpers/TestRunDeco'
import { useEventState } from '@hooks/testRuns/useEventState'
import {
  TestRunEvtText,
  TestRunEventItem,
  TestRunTypeEvtType,
  TestRunEventContainer,
  TestRunEventIconContainer,
  TestRunEventTextContainer,
} from './TestRunsReporter.styled'


export type TTestRunEvt = {
  start:TTestRunEvent
  end?:TTestRunEvent
  canceled?:boolean
  runState:TTestRunEventState
}


const withColin = [
  `feature`,
  `scenario`,
  `rule`,
  `background`
]

const useClassList = (props:TTestRunEvt, evtState:TTestRunEventState) => {
  const {
    start,
    canceled,
    runState,
  } = props

  return useMemo(() => {
    return [
      start.type,
      start.metaType,
      evtState?.status && `gb-evt-state-${evtState.status}`,
      runState?.status && `gb-run-state-${runState.status}`
    ].filter(Boolean).join(` `)
  }, [
    canceled,
    start.type,
    start.metaType,
    evtState?.status,
    runState?.status,
  ])
}
 
const TestRunEventType = (props:TTestRunEvt) => {
  const {
    end,
    start,
  } = props

  const type = start.metaType ? start.metaType : start.type

  return (
    <TestRunTypeEvtType
      className={cls(
        start.type,
        start.metaType,
        `gb-test-run-event-type`
      )}
    >
      {
        withColin.includes(type)
          ? (<>{wordCaps(type)}:</>)
          : (<>{wordCaps(type)}</>)
      }
    </TestRunTypeEvtType>
  )
}

export const TestRunEvent = (props:TTestRunEvt) => {
  const {
    start,
  } = props

  const evtState = useEventState(props, props.canceled)
  const classList = useClassList(props, evtState)

  return (
    <TestRunEventItem className={`gb-test-run-event-item ${classList}`}>
      <TestRunEventContainer className={`gb-test-run-event-container ${classList}`} >
        <TestRunEventIconContainer className='gb-test-run-event-icon-container' >
          <TestRunDeco
            status={evtState.status}
            className='gb-test-run-event-deco'
          />
        </TestRunEventIconContainer>
        <TestRunEventType {...props} />
        <TestRunEventTextContainer
          className={`gb-test-run-event-text-container ${classList}`}
        >
          <TestRunEvtText className={`gb-test-run-event-text ${classList}`}>
            {start.text}
          </TestRunEvtText>
        </TestRunEventTextContainer>
      </TestRunEventContainer>
    </TestRunEventItem>
  )
  
}

