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
  debugHost?:string
  onGetDebuggerUrl:(evt:RMouseEvent) => any
}

export const DebuggerHeader = (props:TDebugger) => {
  const {
    debugUrl,
    debugHost,
    onGetDebuggerUrl
  } = props
  
  return (
    <DebuggerHeaderContainer className='gb-debugger-header-container' >
      <DebuggerHeaderActionContainer className='gb-debugger-header-container' >
        <DebuggerHeaderAction
          text={`Get URL`}
          onClick={onGetDebuggerUrl}
          className='gb-debugger-header-action'
        />
      </DebuggerHeaderActionContainer>
      {debugUrl && (
        <DebuggerHeaderUrlContainer className='gb-debugger-header-url-container' >
          <DebuggerHeaderUrlText className='gb-debugger-header-url-text' >
            {debugHost}?{debugUrl}
          </DebuggerHeaderUrlText>
        </DebuggerHeaderUrlContainer>
      )}
    </DebuggerHeaderContainer>
  )
}