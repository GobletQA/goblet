import type { ComponentProps } from 'react'

import { useCallback } from "react"
import { BrowserBtn } from './Browser.styled'
import { Tooltip, IconButton } from '@gobletqa/components'

export type TBrowserButton = ComponentProps<typeof IconButton> & {
  tooltip: string
}

export const BrowserButton = (props:TBrowserButton) => {
  const { tooltip, onKeyDown, ...rest } = props

  const onKeyDownCB = useCallback((event:any) => {
    if (!(event.target instanceof HTMLTextAreaElement)) event.preventDefault()
    onKeyDown?.(event)
  }, [onKeyDown])

  return (
    <Tooltip
      loc='bottom'
      describeChild
      title={tooltip}
      enterDelay={500}
      fontSize={`10px`}
    >
      <span>
        <BrowserBtn
          {...rest}
          onKeyDown={onKeyDownCB}
        />
      </span>
    </Tooltip>
  )
}

