import type { MouseEvent } from 'react'
import type { TRaceFeature } from '@GBR/types'
import type { TFeatureItem } from './FeatureItems'

import { useState, useRef } from 'react'
import { ESectionType }  from '@GBR/types'
import {
  Menu,
  useInline,
  MenuToggle,
} from '@gobletqa/components'

export type TFeatureMenu = {
  feature:TRaceFeature
  items: TFeatureItem[]
}

export const FeatureMenu = (props:TFeatureMenu) => {
  const {
    items
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
  
  const controlId = `gb-${ESectionType.feature}-menu`

  return (
    <>
      <MenuToggle
        open={open}
        onOpen={onOpen}
        controlId={controlId}
        id="gb-feature-menu-button"
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
        aria-labelledby="gb-feature-menu-button"
      />
    </>
  )
}

