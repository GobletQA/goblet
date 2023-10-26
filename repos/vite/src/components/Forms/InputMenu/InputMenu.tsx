import type { ChangeEvent, MouseEvent, ComponentProps, ComponentType } from 'react'
import type { TMenuItem } from '@gobletqa/components'

import { MenuItems } from './MenuItems'
import {useRef, useState, useMemo } from 'react'
import {
  Menu,
  useInline,
  IconButton,
  GobletIcon,
} from '@gobletqa/components'
import {emptyArr} from '@keg-hub/jsutils'

export type TInputMenuItemClick = (evt:ChangeEvent, ctx:TInputMenuCtx) => void
export type TMenuContextSetInputProps = (props:Partial<ComponentProps<any>>) => void
export type TOnMenuOpen = (event: MouseEvent<HTMLElement>, ...args:any[]) => any
export type TOnMenuClose = (
  event: MouseEvent<HTMLElement>,
  closeParent?:boolean,
  reason?: `backdropClick`|`escapeKeyDown`
) => any

export type TInputMenuItem = {
  id:string
  text:string
  closeMenu?:boolean
  Icon:ComponentType<any>
  onClick?:TInputMenuItemClick
}

export type TInputMenuCtx = {
  open:boolean
  onOpen:TOnMenuOpen
  onClose:TOnMenuClose
  setOpen:(open:boolean) => void
  onChange?:(evt:ChangeEvent, ...args:any[]) => any
  setInputProps?:TMenuContextSetInputProps
}

export type TInputMenu = {
  id:string
  menuId?:string
  items?:TInputMenuItem[]
  setInputProps?:TMenuContextSetInputProps
  onChange?:(evt:ChangeEvent, ...args:any[]) => any
}

const iconProps = {
  svgStyle: {
    width: `18px`,
    height: `18px`,
  }
}

const useMenuItems = (props:TInputMenu) => {
  
  const {
    onChange,
    setInputProps,
    items:menuItems=emptyArr,
  } = props
  

  const [open, setOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLElement|undefined>(undefined)

  const onOpen = useInline((evt: MouseEvent<HTMLElement>) => {
    evt?.stopPropagation?.()
    evt?.preventDefault?.()

    setOpen(true)
    anchorRef.current = evt.currentTarget
  })

  const onClose = useInline<TOnMenuClose>((event) => {
    event?.stopPropagation?.()
    event?.preventDefault?.()

    setOpen(false)
    anchorRef.current = undefined
  })

  const items = useMemo(() => {
    return menuItems.concat(MenuItems).map((item) => {
        return {
          ...item,
          // Wrap the onclick handler, so we can pass in the current context
          // Ignore the empty ctx used to fix type issues
          // The rebuild the true ctx and pass that as the first argument
          onClick: (evt: MouseEvent<HTMLElement>) => {
            evt?.stopPropagation?.()
            evt?.preventDefault?.()

            item?.onClick?.(evt, {
              open,
              onOpen,
              onClose,
              setOpen,
              onChange,
              setInputProps
            })
          }
        } as TMenuItem
      })
  }, [
    open,
    onOpen,
    onClose,
    setOpen,
    onChange,
    setInputProps
  ])

  return {
    open,
    items,
    onOpen,
    onClose,
    anchorRef,
  }
}

export const InputMenu = (props:TInputMenu) => {

  const {
    id=`gb-input-menu`,
    menuId=`gb-input-menu-button`,
  } = props

  const {
    open,
    items,
    onOpen,
    onClose,
    anchorRef,
  } = useMenuItems(props)

  return (
    <>
      <IconButton
        id={menuId}
        onClick={onOpen}
        Icon={GobletIcon}
        iconProps={iconProps}
        aria-haspopup="true"
        aria-controls={open ? id : undefined}
        aria-expanded={open ? 'true' : undefined}
      />
      <Menu
        id={id}
        open={open}
        items={items}
        onOpen={onOpen}
        onClose={onClose}
        anchorRef={anchorRef}
        aria-labelledby={menuId}
      />
    </>
  )
  
}
