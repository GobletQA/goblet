import type { CSSProperties, ReactNode } from 'react'

import { useState } from 'react'
import Box from '@mui/material/Box'
import { WaitTimeout } from '@constants/screencast'
import { LogoutButton } from '@components/Buttons/LogoutButton'
import { useSetTimeout, gutter, Loading } from '@gobletqa/components'

export type TWaitOnContainer = {
  disable?:boolean
  timeout?:number
  messageSx?:CSSProperties
  containerSx?:CSSProperties
  timeoutMessage?: ReactNode
}

export const WaitOnContainer = (props:TWaitOnContainer) => {
  const {
    disable,
    timeout,
    messageSx,
    containerSx,
    timeoutMessage,
  } = props

  const [timedOut, setTimedOut] = useState<boolean>(false)

  useSetTimeout({
    disable,
    // Give the session 20 seconds to start
    // Otherwise show reload warning
    condition: !timedOut,
    callback: () => setTimedOut(true),
    delay: timeout || WaitTimeout || 20,
  })

  const message = !timedOut
    ? `Initializing session....`
    : timeoutMessage || (
      <>
        This is taking longer than normal.
        <br/>
        Please sign out and back in again.
        <br/>
        <br/>
        If the problem persists, please contact support.
      </>
    )

  return disable
    ? null
    : (
      <>
        <Box
          display='flex'
          alignItems='center'
          margin={gutter.margin.dpx}
          marginBottom={gutter.margin.none}
        >
          <Loading
            containerSx={containerSx}
            color={timedOut ? `error` : undefined}
            message={message}
            messageSx={[{
              marginTop: gutter.margin.dpx,
              marginBottom: gutter.margin.px
            }, messageSx] as CSSProperties[]}
          />
        </Box>
        {timedOut && (
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            margin={gutter.margin.dpx}
            marginTop={gutter.margin.px}
          >
            <LogoutButton />
          </Box>
        )}
      </>
    )
}
