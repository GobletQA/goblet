import type { MouseEvent } from 'react'
import type { TOnMenuClose, TMenuItem } from '@gobletqa/components'
import type {
  Parkin,
  TWorldConfig,
  TStepDefsList 
} from '@ltipton/parkin'
import type {
  TAudit,
  TOnSubMenu,
  TRaceFeature,
  TRaceMenuItem,
  TOnWorldChange,
  TMenuContextRef,
  TUpdateFeatureCB,
} from '@GBR/types'

import { exists } from '@keg-hub/jsutils'
import { useCallback, useState, useRef } from 'react'

export type THUseSubMenu = TMenuContextRef & {
  parkin: Parkin
  audit: TAudit
  defs: TStepDefsList
  world: TWorldConfig
  onClose:TOnMenuClose
  feature: TRaceFeature
  updateWorld: TOnWorldChange
  contextItems: TRaceMenuItem[]
  updateFeature: TUpdateFeatureCB
  onChange:(...args:any[]) => any
}

/**
 * Ability to create a sub menu
 * Allows menu items to pass submenu items
 * And create a another menu from the existing menu
 */
export const useSubMenu = (props:THUseSubMenu) => {
  const { onClose:onCloseParent } = props

  const [open, setOpen] = useState<boolean>(false)
  const [items, setSubitems] = useState<TMenuItem[]>([])
  const anchorRef = useRef<HTMLElement|undefined>(undefined)

  const onClose = useCallback((event:MouseEvent<HTMLElement>, closeParent?:boolean) => {
    setOpen(false)
    setSubitems([])
    anchorRef.current = undefined
    closeParent && onCloseParent?.(event)
  }, [onCloseParent])

  const onSubmenu = useCallback((event:MouseEvent<HTMLElement>, data:TOnSubMenu) => {

    const toggle = exists<boolean>(data.open) ? data.open : !open

    if(!toggle && !open) return
    if(!toggle) return onClose(event, data.closeParent)

    anchorRef.current = event.currentTarget
    data.items !== items && setSubitems(data.items)

    setOpen(true)
  }, [
    open,
    items,
    onClose,
    setOpen,
    setSubitems,
  ])

  return {
    onSubmenu,
    submenuProps: {
      open,
      items,
      onClose,
      anchorRef,
      posTH: `left`,
      posAH: `right`,
      posTV: `center`,
      posAV: `bottom`,
    },
  }
}