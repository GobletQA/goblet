import type { TDefGroup } from '@types'
import type { EStepKey } from '@ltipton/parkin'
import type { ReactNode, ElementType } from 'react'
import { Fragment } from 'react'
import { isValidFuncComp } from '@utils/components'
import { DefinitionListItem } from './DefinitionListItem'
import { DefItemDivider, DefListSubheader } from './DefinitionList.styled'

export type TDefinitionListGroup = {
  type:EStepKey
  group:TDefGroup
  Header?:ElementType<any> | ReactNode
}

export const DefinitionListGroup = (props:TDefinitionListGroup) => {
  const {
    type,
    group,
    Header
  } = props

  const section = `section-${type}`

  return (
    <li className={section} >
      <ul className={`${section}-list-items`} >

        <DefListSubheader className={`gb-defs-${section}-sub-header`} >
          {
            !Header
              ? group.group
              : isValidFuncComp(Header)
                ? (<Header type={type} group={group} />)
                : Header
          }
        </DefListSubheader>

        <DefItemDivider className='gb-def-sub-header-divider' />

        {group.items.map((item) => {
          return (
            <Fragment key={`item-${type}-${item.uuid}`} >
              <DefinitionListItem
                item={item}
                type={type as EStepKey}
              />
              <DefItemDivider className='gb-def-list-item-divider' />
            </Fragment>
          )
        })}
      </ul>
    </li>
  )
}