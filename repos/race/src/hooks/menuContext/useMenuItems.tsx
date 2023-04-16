import type { MouseEvent } from 'react'
import type { TOnMenuClose, TMenuItem } from '@gobletqa/components'
import type { TRaceMenuItemClickCtx, TMenuContextRef } from '@GBR/types'

import { useSubMenu } from './useSubMenu'
import { useInline } from '@gobletqa/components'
import { useMemo, useState, useRef } from 'react'
import {
  useParkin,
  useEditor,
  useStepDefs,
  useMenuContext
} from '@GBR/contexts'

export type TMenuContentItem = Omit<TMenuItem, `onClick`> & {
  onClick: (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => void
}

export type THMenuItems = TMenuContextRef & {
  id:string
  parentId:string
  items: TMenuContentItem[]
  // TODO: figure out the props for this method
  onChange:(...args:any[]) => any
}

export const useMenuItems = (props:THMenuItems) => {
  const {
    type,
    gran,
    parent,
    active,
    context,
    setInputProps,
    items:menuItems,
  } = props

  const { defs, setDefs } = useStepDefs()
  const onChange = useInline(props.onChange)
  const { feature, updateFeature } = useEditor()
  const { parkin, world, updateWorld } = useParkin()
  
  const [open, setOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement|undefined>(undefined)
  const onOpen = useInline((event: MouseEvent<HTMLElement>) => {
    setOpen(true)
    anchorRef.current = event.currentTarget
  })

  const onClose = useInline<TOnMenuClose>((event) => {
    setOpen(false)
    anchorRef.current = undefined
  })

  const contextItems = useMenuContext(context)
  const {
    onSubmenu,
    submenuProps,
  } = useSubMenu({
    defs,
    type,
    gran,
    world,
    parent,
    active,
    parkin,
    onClose,
    feature,
    onChange,
    updateWorld,
    contextItems,
    updateFeature,
    setInputProps,
  })

  const items = useMemo(() => {
    return (contextItems as TMenuContentItem[]).concat(menuItems)
      .map(item => {

        return {
          ...item,
          // Wrap the onclick handler, so we can pass in the current context
          // Ignore the empty ctx used to fix type issues
          // The rebuild the true ctx and pass that as the first argument
          onClick: (evt: MouseEvent<HTMLElement>) => item?.onClick({
            open,
            type,
            defs,
            gran,
            world,
            parkin,
            parent,
            active,
            onOpen,
            onClose,
            setOpen,
            setDefs,
            feature,
            onChange,
            onSubmenu,
            updateWorld,
            updateFeature,
            setInputProps,
          } as TRaceMenuItemClickCtx, evt)
        } as TMenuItem
      })
  }, [
    defs,
    open,
    type,
    gran,
    world,
    parent,
    active,
    parkin,
    feature,
    setDefs,
    menuItems,
    updateWorld,
    contextItems,
    setInputProps,
    updateFeature,
  ])

  return {
    open,
    items,
    onOpen,
    setOpen,
    onClose,
    anchorRef,
    submenuProps,
  }
}
