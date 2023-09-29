
import {
  TestRunsMsgText,
  TestRunsMsgIcon,
  TestRunsMsgContainer,
  TestRunsMsgTextContainer,
  TestRunsMsgContentContainer,
} from './TestRunsMsg.styled'

import {ComponentType, ReactNode} from 'react'
import {cls} from '@keg-hub/jsutils'

export type TTestRunsMsg = {
  textClass?:string
  className?:string
  iconClass?:string
  message?:ReactNode
  children?:ReactNode
  Icon?:ComponentType<any>
}

export const TestRunsMsg = (props:TTestRunsMsg) => {
  const {
    message,
    children,
    iconClass,
    textClass,
    className,
    Icon=TestRunsMsgIcon,
  } = props

  return (
    <TestRunsMsgContainer
      className={cls(`gb-test-runs-msg`, className)}
    >
        <TestRunsMsgContentContainer>

          {message && (
            <TestRunsMsgTextContainer
              className={cls(`gb-test-runs-msg-text`, textClass)}
            >
              {Icon && (
                <Icon className={cls(`gb-test-runs-msg-icon`, iconClass)} />
              ) || null}

              <TestRunsMsgText>
                {message}
              </TestRunsMsgText>

            </TestRunsMsgTextContainer>
          ) || null}

          {children}
        </TestRunsMsgContentContainer>
    </TestRunsMsgContainer>
  )
}
