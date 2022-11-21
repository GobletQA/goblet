import type { ComponentProps } from 'react'

import { useCallback } from "react"
import { BrowserBtn } from './Browser.styled'
import { IconButton } from '@components/Buttons/IconButton'

export type TBrowserButton = ComponentProps<typeof IconButton>

export const BrowserButton = (props:TBrowserButton) => {
  const { onKeyDown, ...rest } = props

  const onKeyDownCB = useCallback((event:any) => {
    if (!(event.target instanceof HTMLTextAreaElement)) event.preventDefault()
    onKeyDown?.(event)
  }, [onKeyDown])

  return (
    <BrowserBtn
      {...rest}
      onKeyDown={onKeyDownCB}
    />
  )
}

