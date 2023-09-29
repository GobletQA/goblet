import {cls, wordCaps} from '@keg-hub/jsutils'
import type { TTestRunEvent, TTestRunEventState } from '@types'

import { useEffect, useMemo, useRef } from 'react'
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
import { scrollFirstParent } from '@gobletqa/components'


export type TTestRunEvt = {
  canceled?:boolean
  end?:TTestRunEvent
  start:TTestRunEvent
  allTestsRunning?:boolean
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
    end,
    start,
    allTestsRunning,
  } = props

  const itemRef = useRef<HTMLDivElement>()
  const scrolledRef = useRef<boolean>(false)
  const evtState = useEventState(props, props.canceled)
  const classList = useClassList(props, evtState)

  useEffect(() => {
    if(!allTestsRunning) return

    if(evtState.status !== `running` && !scrolledRef?.current && itemRef.current){
      scrolledRef.current = true
      const parent = scrollFirstParent(itemRef.current)
      if(!parent) return

      const rect = itemRef.current.getBoundingClientRect()
      parent.scrollBy({
        // The 145 comes from trial and error. Seems to work when testing. Nothing special about it
        behavior: `smooth`,
        top: rect.top - 145,
      })
    }

  }, [
    evtState.status,
    allTestsRunning
  ])


  return (
    <TestRunEventItem className={`gb-test-run-event-item ${classList}`}>
      <TestRunEventContainer ref={itemRef} className={`gb-test-run-event-container ${classList}`} >
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

