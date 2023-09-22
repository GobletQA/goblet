import type { TTestRunEvent } from '@types'

import {
  TestRunEventsContainer,
  TestRunEventsDropdown,
  TestRunEventItem,
  TestRunEventContainer,
  TestRunEventText,
  TestRunEventIconContainer,
} from './TestRunEvents.styled'

export type TTestRunEvt = {
  start:TTestRunEvent
  end?:TTestRunEvent
}

export const TestRunEvent = (props:TTestRunEvt) => {
  const {
    end,
    start,
  } = props

  return (
    <TestRunEventItem>
      <TestRunEventContainer>
        <TestRunEventIconContainer>
          {start.status}
        </TestRunEventIconContainer>
        <TestRunEventText>
          {start.type} {start.text}
        </TestRunEventText>
      </TestRunEventContainer>
    </TestRunEventItem>
  )
  
}

