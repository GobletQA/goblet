import type { CSSProperties, ReactNode, ElementType } from 'react'
import type { TGroups, TGroupItem } from '@GBC/types'

import { cls } from '@keg-hub/jsutils'
import { ListGroup } from './ListGroup'
import { List as ListComp, ListSubheader } from './List.styled'

export type TList = {
  groups?:TGroups
  sx?:CSSProperties
  className?:string
  itemClass?:string
  itemsClass?:string
  groupClass?:string
  headerClass?:string
  showHeader?:boolean
  itemDivider?:boolean
  headerDivider?:boolean
  items?:TGroupItem[]
  containGroup?:boolean
  SubHeader?:ReactNode
  groupSx?:CSSProperties
  itemsSx?:CSSProperties
  headerSx?:CSSProperties
  Header?:ElementType<any> | ReactNode
}

export const List = (props:TList) => {
  const {
    sx,
    items,
    Header,
    groups,
    groupSx,
    itemsSx,
    headerSx,
    className,
    itemClass,
    SubHeader,
    groupClass,
    itemsClass,
    headerClass,
    showHeader,
    itemDivider,
    containGroup,
    headerDivider,
  } = props

  return (
    <ListComp
      sx={sx}
      subheader={SubHeader}
      className={cls(`gb-list-container`, className)}
    >
      {items && (
        <ListGroup
          sx={groupSx}
          Header={Header}
          itemsSx={itemsSx}
          headerSx={headerSx}
          itemClass={itemClass}
          className={groupClass}
          showHeader={showHeader}
          itemsClass={itemsClass}
          headerClass={headerClass}
          itemDivider={itemDivider}
          containGroup={containGroup}
          headerDivider={headerDivider}
          type={`default-list-group`}
          group={{
            items,
            toggled: true,
            type:`default-list-group`,
          }}
        />
      ) || null}
      {groups && Object.entries(groups).map(([type, group]) => {
        return (
            <ListGroup
              key={`section-${type}`}
              type={type}
              sx={groupSx}
              group={group}
              Header={Header}
              itemsSx={itemsSx}
              itemClass={itemClass}
              className={groupClass}
              showHeader={showHeader}
              itemsClass={itemsClass}
              itemDivider={itemDivider}
              containGroup={containGroup}
              headerDivider={headerDivider}
            />
          )
      }) || null}
      
    </ListComp>
  )
}
