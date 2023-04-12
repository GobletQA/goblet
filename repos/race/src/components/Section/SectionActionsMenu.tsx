import type { MouseEvent } from 'react'
import type { TMenuItem } from '@gobletqa/components'

import { useState, useRef } from 'react'
import { ESectionType, ESectionExt }  from '@GBR/types'
import {
  Menu,
  MenuIcon,
  MenuToggle,
  useInline,
  IconButton,
} from '@gobletqa/components'


export type TSectionActionsMenu = {
  id:string
  items: TMenuItem[]
  type: ESectionType|ESectionExt
}

const styles = {
  button: {
    padding: `5px`
  }
}

export const SectionActionsMenu = (props:TSectionActionsMenu) => {
  const {
    id,
    type,
    items
  } = props
  
  const [open, setOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement|undefined>(undefined)

  const onOpen = useInline((event: MouseEvent<HTMLElement>) => {
    event?.stopPropagation?.()
    setOpen(true)
    anchorRef.current = event.currentTarget
  })

  const onClose = useInline((event:any) => {
    event?.stopPropagation?.()
    setOpen(false)
    anchorRef.current = undefined
  })

  const controlId = `gb-${type}-menu`

  return (
    <>
      <MenuToggle
        onOpen={onOpen}
        sx={styles.button}
        controlId={controlId}
        id={`gb-${id}-menu-button`}
      />
      <Menu
        open={open}
        posTV='top'
        posTH='right'
        posAH='right'
        posAV='bottom'
        items={items}
        id={controlId}
        onOpen={onOpen}
        onClose={onClose}
        anchorRef={anchorRef}
        aria-labelledby={`gb-section-menu-button gb-section-${type}-menu-button`}
      />
    </>
  )
}

