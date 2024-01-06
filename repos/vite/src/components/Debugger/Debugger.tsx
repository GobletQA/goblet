import type { TBrowserDebuggerCfg } from '@types'
import {
  DebuggerFrame,
  DebuggerContainer
} from './Debugger.styled'

export type TDebugger = {
  debugUrl?:string
  debugHost?:string
}

export const Debugger = (props:TDebugger) => {

  const {
    debugUrl,
    debugHost,
  } = props

  return (
    <DebuggerContainer className='gb-debugger-container' >
      <DebuggerFrame
        width={`100%`}
        height={`100%`}
        allow="fullscreen"
        name="gobletqa-debugger"
        className='gb-debugger-frame'
        title="GobletQA Browser Debugger"
        src={`${debugHost}?${debugUrl}`}
      />
    </DebuggerContainer>
  )
}