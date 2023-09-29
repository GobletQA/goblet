import type { CSSProperties } from 'react'
import type { TNavItemProps } from './NavItem'

import { useMemo } from 'react'
import { useApp } from '@store'
import { NavItem } from './NavItem'
import { ESideNav, EEditorType } from '@types'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import { EditorNavItems } from '@constants/nav'
import {cls} from '@keg-hub/jsutils'


export type TNavListProps = {
  group: string
  index?: number
  open?: boolean
  activeNav?: string
  className?: string
  items: TNavItemProps[]
  groupStyle?: CSSProperties
}

export type TNavListItem = {
  idx:number
  last:boolean
  first:boolean
  group: string
  open?: boolean
  editor:EEditorType
  activeNav?: string
  item:TNavItemProps
}

const useEditorItem = (props:TNavListItem) => {
  const { editor, item } = props

  return useMemo(() => {
    return item.name === ESideNav.editor
      ? EditorNavItems[editor] as TNavItemProps
      : item
  }, [item.name, editor])
} 


const NavListItem = (props:TNavListItem) => {
  const { editor, item, ...rest } = props

  const navItem = useEditorItem(props)

  return (
    <>
      {(navItem.divider === 'top' || navItem.divider === true) && (<Divider />)}
      <NavItem {...navItem} {...rest} />
      {(navItem.divider === 'bottom' || navItem.divider === true) && (<Divider />)}
    </>
  )
}

export const NavList = (props:TNavListProps) => {
  const { items, groupStyle, group, open, className, activeNav } = props
  const { editor } = useApp()
  
  const itemLength = items.length - 1
  return (
    <List
      sx={groupStyle}
      className={cls(className, `${group}-group-nav-list`)}
    >
      {items.map((item:TNavItemProps, idx:number) => {
        return (
          <NavListItem
            idx={idx}
            item={item}
            open={open}
            group={group}
            editor={editor}
            first={idx === 0}
            activeNav={activeNav}
            last={idx === itemLength}
            key={`${group}-${item.title}`}
          />
        )
      })}
    </List>
  )
}
