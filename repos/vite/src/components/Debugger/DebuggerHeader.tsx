import type { MouseEvent as RMouseEvent } from 'react'

import {
  DebuggerHeaderAction,
  DebuggerHeaderUrlText,
  DebuggerHeaderContainer,
  DebuggerHeaderUrlContainer,
  DebuggerHeaderActionContainer
} from './Debugger.styled'

export type TDebugger = {
  debugUrl?:string
  onGetDebuggerUrl:(evt:RMouseEvent) => any
}

export const DebuggerHeader = (props:TDebugger) => {
  const {
    debugUrl,
    onGetDebuggerUrl
  } = props
  
  return (
    <DebuggerHeaderContainer className='gb-debugger-header-container' >
      {debugUrl && (
        <DebuggerHeaderUrlContainer className='gb-debugger-header-url-container' >
          <DebuggerHeaderUrlText className='gb-debugger-header-url-text' >
            {debugUrl}
          </DebuggerHeaderUrlText>
        </DebuggerHeaderUrlContainer>
      )}
      <DebuggerHeaderActionContainer className='gb-debugger-header-container' >
        <DebuggerHeaderAction
          text={`Get Debugger URL`}
          onClick={onGetDebuggerUrl}
          className='gb-debugger-header-action'
        />
      </DebuggerHeaderActionContainer>
    </DebuggerHeaderContainer>
  )
}