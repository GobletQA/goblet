import type { MouseEvent as RMouseEvent } from 'react'

import { toggleInspector } from '@actions/app/toggleInspector'
import {
  DebuggerReloadIcon,
  DebuggerCloseIcon,
  DebuggerHeaderAction,
  DebuggerHeaderUrlText,
  DebuggerHeaderContainer,
  DebuggerHeaderUrlContainer,
  DebuggerHeaderActionContainer
} from './Debugger.styled'

export type TDebugger = {
  debugUrl?:string
  debugHost?:string
  onReloadUrl:(evt:RMouseEvent) => any
}

export const DebuggerHeader = (props:TDebugger) => {
  const {
    debugUrl,
    debugHost,
    onReloadUrl
  } = props
  
  return (
    <DebuggerHeaderContainer className='gb-debugger-header-container' >
      <DebuggerHeaderActionContainer className='gb-debugger-header-actions-container' >
        <DebuggerHeaderAction
          onClick={onReloadUrl}
          color={`info`}
          Icon={DebuggerReloadIcon}
          tooltip={`Reload Inspector`}
          className='gb-debugger-header-action-reload'
        />
        <DebuggerHeaderAction
          color={`error`}
          Icon={DebuggerCloseIcon}
          tooltip={`Close Inspector`}
          onClick={() => toggleInspector(false)}
          className='gb-debugger-header-action-close'
        />
      </DebuggerHeaderActionContainer>
    </DebuggerHeaderContainer>
  )
}