import type { MouseEvent } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TRaceMenuItemClickCtx, TMenuContextRef } from '@GBR/types'

import { useMemo, useState, useRef } from 'react'
import { useInline } from '@gobletqa/components'
import {
  useParkin,
  useEditor,
  useStepDefs,
  useMenuContext
} from '@GBR/contexts'

export type THMenuItems = TMenuContextRef & {
  id:string
  parentId:string
  onChange:(...args:any[]) => any
  items: TMenuItem<TRaceMenuItemClickCtx>[]
}

export const useMenuItems = (props:THMenuItems) => {
  const {
    type,
    gran,
    items,
    parent,
    active,
    context,
    onChange,
    setInputProps,
  } = props

  const { defs, setDefs } = useStepDefs()
  const onChangeInline = useInline(onChange)
  const { feature, updateFeature } = useEditor()
  const { parkin, world, updateWorld } = useParkin()
  
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

  const contextItems = useMenuContext(context)

  const menuItems = useMemo(() => {
    return (contextItems as TMenuItem<TRaceMenuItemClickCtx>[])
      .concat(items as TMenuItem<TRaceMenuItemClickCtx>[])
      .map(item => {
        return {
          ...item,
          // Wrap the onclick handler, so we can pass in the current context
          // Ignore the empty ctx used to fix type issues
          // The rebuild the true ctx and pass that as the first argument
          onClick: (__:any, evt: MouseEvent<HTMLElement>) => item?.onClick({
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
            updateWorld,
            updateFeature,
            setInputProps,
            onChange: onChangeInline
          } as TRaceMenuItemClickCtx, evt)
        }
      })
  }, [
    defs,
    open,
    type,
    gran,
    items,
    world,
    parent,
    active,
    parkin,
    feature,
    setDefs,
    updateWorld,
    contextItems,
    setInputProps,
    updateFeature,
  ])

  return {
    open,
    onOpen,
    setOpen,
    onClose,
    anchorRef,
    items: menuItems
  }
  
  
}
