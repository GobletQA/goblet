import type { MouseEvent } from 'react'
import type { TMenuItem } from '@gobletqa/components'

import { useState, useRef } from 'react'

import {
  Menu,
  useInline,
  IconButton,
  GobletIcon,
} from '@gobletqa/components'

export type TExpressionMenu = {
  id:string
  parentId:string
  items: TMenuItem[]
}

export const ExpressionMenu = (props:TExpressionMenu) => {

  const {
    items,
    id="gr-expressions-menu",
    parentId="gc-expressions-menu-button"
  } = props

  const [open, setOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement|undefined>(undefined)
  const onOpen = useInline((event: MouseEvent<HTMLElement>) => {
    setOpen(true)
    anchorRef.current = event.currentTarget
  })

  const onClose = useInline(() => {
    setOpen(false)
    anchorRef.current = undefined
  })

  return (
    <>
      <IconButton
        id={parentId}
        onClick={onOpen}
        Icon={GobletIcon}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? id : undefined}
      />
      <Menu
        id={id}
        open={open}
        items={items}
        onOpen={onOpen}
        onClose={onClose}
        anchorRef={anchorRef}
        aria-labelledby={parentId}
      />
    </>
  )
  
}