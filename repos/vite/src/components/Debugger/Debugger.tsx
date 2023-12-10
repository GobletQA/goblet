import type { TBrowserDebuggerCfg } from '@types'
import {
  DebuggerFrame,
  DebuggerContainer
} from './Debugger.styled'

export type TDebugger = {
  debugUrl?:string
}

export const Debugger = (props:TDebugger) => {
  return (
    <DebuggerContainer className='gb-debugger-container' >
      <DebuggerFrame
        width={`100%`}
        height={`100%`}
        allow="fullscreen"
        name="gobletqa-debugger"
        className='gb-debugger-frame'
        title="GobletQA Browser Debugger"
        src={`https://lancetipton.github.io/chrome-devtools/${props.debugUrl || ``}`}
      />
    </DebuggerContainer>
  )
}