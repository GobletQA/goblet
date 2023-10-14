import type { TGroupItem } from '@GBC/types'
import type { MouseEvent, CSSProperties, ComponentType, ReactNode } from 'react'

import { useState, useCallback } from 'react'
import { Item } from './List.styled'
import { cls, isFunc } from '@keg-hub/jsutils'
import { ArrowRightIcon } from '@GBC/components/Icons'
import {isValidFuncComp} from '@GBC/utils/components/isValidFuncComp'
import {
  ItemText,
  ItemIcon,
  ItemButton,
  ItemRow,
  ItemMetaCollapse,
} from './ListItem.styled'
import {
  ItemDivider,
} from './List.styled'

import { isValidElement } from 'react'

export type TListItem = TGroupItem & {
  type:string
  sx?:CSSProperties
  className?:string
  Item?: ComponentType<any>
  Meta?:ComponentType<any>|ReactNode
  Content?:ComponentType<any>|ReactNode
  Actions?:ComponentType<any>|ReactNode
  [key:string]: any
}

const styles = {
  arrow: {
    open: {
      transform: `rotate(90deg)`,
    },
    closed: {
      transform: `rotate(0)`,
    }
  }
}

const ItemActions = (props:TListItem):any => {
  const {
    Action
  } = props

  return isValidFuncComp(Action)
    ? <Action {...props} />
    : Action || null
}

const ItemMeta = (props:TListItem):any => {
  const {
    Meta
  } = props
  
  return isValidFuncComp(Meta)
      ? <Meta {...props} />
      : Meta || null
}


const ItemComp = (props:TListItem) => {
  const {
    Meta,
    title,
    Actions,
    onClick,
  } = props

  const [open, setOpen] = useState<boolean>(false)

  const onToggleMeta = useCallback((evt:MouseEvent<HTMLDivElement>) => {
    setOpen(!open)
    onClick?.(evt)
  }, [open])

  return (
    <>
      <ItemRow onClick={onToggleMeta} className='gb-list-item-row' >

        <ItemButton
          className='gb-list-item-meta-toggle'
        >
          <ItemIcon className='gb-list-item-meta-toggle-icon' >
            <ArrowRightIcon 
              sx={open ? styles.arrow.open : styles.arrow.closed}
            />
          </ItemIcon>
        </ItemButton>

        <ItemText className='gb-list-item-text' primary={title} />
        {Actions && (
          <ItemActions {...props} />
        ) || null}
      </ItemRow>

      {Meta && (
        <ItemMetaCollapse
          in={open}
          timeout="auto"
          unmountOnExit
        >
          <ItemDivider className='gb-list-item-divider' />
          <ItemMeta {...props} />
        </ItemMetaCollapse>
      ) || null}
    </>
  )
}


const ItemContainer = (props:TListItem) => {
  const {
    sx,
    type,
    open,
    uuid,
    className,
    Content,
  } = props

  return (
     <Item
        sx={sx}
        className={cls(className, `gb-list-item`, open ? `item-open` : ``)}
        key={`item-${type}-${uuid}`}
      >
      {
        Content
          ? isValidFuncComp(Content)
            ? <Content {...props} />
            : Content
          : <ItemComp {...props} />
      }
      </Item>
    )
}


export const ListItem = (props:TListItem) => {
  const { Item:ItemComp } = props

  return ItemComp
    ? (<ItemComp {...props} />)
    : (<ItemContainer {...props} />)
}