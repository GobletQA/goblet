import type { ComponentProps } from 'react'

import { IconButton } from '@components/Buttons/IconButton'
import { useCallback } from "react"

export type TBrowserButton = ComponentProps<typeof IconButton>

export const BrowserButton = (props:TBrowserButton) => {
  const { onKeyDown, ...rest } = props

  const onKeyDownCB = useCallback((event:any) => {
    if (!(event.target instanceof HTMLTextAreaElement)) event.preventDefault()
    onKeyDown?.(event)
  }, [onKeyDown])

  return (
    <IconButton
      {...rest}
      onKeyDown={onKeyDownCB}
      sx={[{
        width: `28px`,
        height: `28px`,
        display: `flex`,
        color: `#FFFFFF`,
        borderRadius: `50%`,
        placeItems: `center`,
        fontFamily: `inherit`,
        placeContent: `center`,
        backgroundColor: `transparent`,
        transition: `background 0.2s ease-in-out`,
        [`&:disabled`]: {
          color: `rgba(255, 255, 2555, 0.25)`
        }
      }]}
    />
  )
}

