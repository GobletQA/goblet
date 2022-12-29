import type { CSSObj } from '@types'
import type { ReactNode } from 'react'

import { useState } from 'react'
import Box from '@mui/material/Box'
import { Loading } from '@components/Loading'
import { useSetTimeout } from '@hooks/useSetTimeout'
import { gutter } from '@gobletqa/components/theme'
import { LogoutButton } from '@components/Buttons/LogoutButton'

export type TWaitOnContainer = {
  disable?:boolean
  timeout?:number
  messageSx?:CSSObj
  containerSx?:CSSObj
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
    delay: timeout || 15000,
    callback: () => setTimedOut(true),
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
        If the problem persists, please let us know.
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
            }, messageSx] as CSSObj[]}
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
