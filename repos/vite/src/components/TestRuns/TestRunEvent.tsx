import {cls, wordCaps} from '@keg-hub/jsutils'
import type { TTestRunEvent } from '@types'

import { TestRunDeco } from './TestRunDeco'
import { useEventState } from '@hooks/testRuns/useEventState'
import {
  TestRunEvtText,
  TestRunEventItem,
  TestRunTypeEvtType,
  TestRunStepEvtType,
  TestRunParentEvtType,
  TestRunFeatureEvtType,
  TestRunEventContainer,
  TestRunEventIconContainer,
  TestRunEventTextContainer,
} from './TestRunsReporter.styled'

import {
  PurpleText,
  YellowText,
  GreenText,
} from '@gobletqa/components'

export type TTestRunEvt = {
  start:TTestRunEvent
  end?:TTestRunEvent
}

const EventTypeMap = {
  step: TestRunStepEvtType,
  rule: TestRunParentEvtType,
  scenario: TestRunParentEvtType,
  background: TestRunParentEvtType,
  feature: TestRunFeatureEvtType,
}

const withColin = [
  `feature`,
  `scenario`,
  `rule`,
  `background`
]

const TestRunEventType = (props:TTestRunEvt) => {
  const {
    end,
    start,
  } = props

  const type = start.metaType ? start.metaType : start.type
  const Component = EventTypeMap[type as keyof typeof EventTypeMap] || TestRunTypeEvtType

  return (
    <Component
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
    </Component>
  )
}

export const TestRunEvent = (props:TTestRunEvt) => {
  const {
    end,
    start,
  } = props


  const evtState = useEventState(props)

  return (
    <TestRunEventItem
      className={cls(
        start.type,
        start.metaType,
        `gb-test-run-event-item`
      )}
    >
      <TestRunEventContainer className='gb-test-run-event-container' >
        <TestRunEventIconContainer className='gb-test-run-event-icon-container' >
          <TestRunDeco
            status={evtState.status}
            className='gb-test-run-event-deco'
          />
        </TestRunEventIconContainer>
        <TestRunEventTextContainer
          className={cls(
            start.type,
            start.metaType,
            'gb-test-run-event-text-container'
          )}
        >
          <TestRunEventType {...props} />
          <TestRunEvtText
            className={cls(
                start.type,
                start.metaType,
              `gb-test-run-event-text`
            )}
          >
            {start.text}
          </TestRunEvtText>
        </TestRunEventTextContainer>
      </TestRunEventContainer>
    </TestRunEventItem>
  )
  
}

