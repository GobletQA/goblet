import type { TGroup } from '@GBC/types'
import type { CSSProperties, ReactNode, ElementType } from 'react'

import { Fragment } from 'react'
import { ListItem } from './ListItem'
import { isValidFuncComp } from '@GBC/utils/components'
import {
  ItemDivider,
  ListSubheader,
  ListGroupItems,
  ListGroupContainer
} from './List.styled'
import {cls} from '@keg-hub/jsutils'

export type TListGroup = {
  type:string
  group:TGroup
  sx?:CSSProperties
  itemSx?:CSSProperties
  itemsSx?:CSSProperties
  headerSx?:CSSProperties
  showHeader?:boolean
  itemDivider?:boolean
  headerDivider?:boolean
  containGroup?:boolean
  className?:string
  itemClass?:string
  itemsClass?:string
  headerClass?:string
  dividerClass?:string
  Header?:ElementType<any> | ReactNode
}


const GroupItems = (props:TListGroup & { section:string }) => {
  const {
    type,
    group,
    Header,
    itemSx,
    section,
    headerSx,
    itemClass,
    headerClass,
    dividerClass,
    showHeader=true,
    itemDivider=true,
    headerDivider=true,
  } = props

  return (
    <Fragment>
      {showHeader && (
        <ListSubheader
          sx={headerSx}
          className={cls(headerClass, `gb-list-${section}-sub-header`)}
        >
          {
            !Header
              ? group.group
              : isValidFuncComp(Header)
                ? (<Header type={type} group={group} />)
                : Header
          }
        </ListSubheader>
      ) || null}

      {headerDivider && (
        <ItemDivider className={cls(dividerClass, `gb-list-sub-header-divider`)} />
      ) || null}

      {group?.items?.map((item) => {
        return (
          <Fragment key={`item-${type}-${item.uuid}`} >
            <ListItem
              type={type}
              sx={itemSx}
              className={itemClass}
              {...item}
            />
            {itemDivider && (
              <ItemDivider className={cls(dividerClass, `gb-list-item-divider`)} />
            ) || null}
          </Fragment>
        )
      })}
    </Fragment>
  )
}

export const ListGroup = (props:TListGroup) => {
  const {
    sx,
    type,
    itemsSx,
    className,
    itemsClass,
    containGroup=true,
  } = props

  const section = `section-${type}`

  return containGroup
    ? (
        <ListGroupContainer sx={sx} className={cls(section, className)} >
          <ListGroupItems sx={itemsSx} className={cls(`${section}-list-items`, itemsClass)} >
            <GroupItems {...props} section={section} />
          </ListGroupItems>
        </ListGroupContainer>
      )
    : (<GroupItems {...props} section={section} />)
}