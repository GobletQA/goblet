import type { TPlayerResEvent } from '@types'

import {
  TestRunEventsContainer,
  TestRunEventsDropdown,
  TestRunEventItem,
  TestRunEventContainer,
  TestRunEventText,
  TestRunEventIconContainer,
} from './TestRunEvents.styled'

export type TTestRunEvent = {
  [key:string]: any
}

export const TestRunEvent = (props:TTestRunEvent) => {
  const {
    type,
    text,
    status,
    description,
  } = props

  return (
    <TestRunEventItem>
      <TestRunEventContainer>
        <TestRunEventIconContainer>
          {status}
        </TestRunEventIconContainer>
        <TestRunEventText>
          {type} {text}
        </TestRunEventText>
      </TestRunEventContainer>
    </TestRunEventItem>
  )
  
}

