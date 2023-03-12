import type { ComponentType, MouseEvent } from 'react'
import type { TMenuItem } from '@gobletqa/components'

import { useState, useRef } from 'react'

import {
  Menu,
  MenuIcon,
  useInline,
  IconButton,
} from '@gobletqa/components'


export type TFeatureItems = {
  Icon?:ComponentType<any>
  onClick: (...args:any[]) => any
}

export type TFeatureMenu = {
  items: TMenuItem[]
}

export const FeatureMenu = (props:TFeatureMenu) => {
  const {
    items
  }  = props
  
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
        Icon={MenuIcon}
        onClick={onOpen}
        aria-haspopup="true"
        id="gb-feature-menu-button"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'gb-feature-menu' : undefined}
      />
      <Menu
        posTV='top'
        posTH='right'
        posAH='right'
        posAV='bottom'
        open={open}
        items={items}
        onOpen={onOpen}
        onClose={onClose}
        id="gb-feature-menu"
        anchorRef={anchorRef}
        aria-labelledby="gb-feature-menu-button"
      />
    </>
  )
}

