import {
  DebuggerErrorText,
  DebuggerErrorIcon,
  DebuggerErrorContent,
  DebuggerErrorContainer
} from './Debugger.styled'

export type TDebuggerError = {
  error?:string
}

export const DebuggerError = (props:TDebuggerError) => {
  const {
    error
  } = props
  
  return (
    <DebuggerErrorContainer className='gb-debugger-error-container' >

      <DebuggerErrorContent className='gb-debugger-error-content' >
        <DebuggerErrorIcon className='gb-debugger-error-icon' />
        <DebuggerErrorText className='gb-debugger-error-text' >
          {error}
        </DebuggerErrorText>
      </DebuggerErrorContent>

    </DebuggerErrorContainer>
  )
}
