import type { ReactNode, ElementType } from 'react'
import type { EStepKey, TDefGroup } from '@types'

import { Fragment } from 'react'
import Divider from '@mui/material/Divider'
import { isValidFuncComp } from '@utils/components'
import { DefListSubheader } from './DefinitionList.styled'
import { DefinitionListItem } from './DefinitionListItem'

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

        <DefListSubheader className={`goblet-defs-${section}-sub-header`} >
          {
            !Header
              ? group.group
              : isValidFuncComp(Header)
                ? (<Header type={type} group={group} />)
                : Header
          }
        </DefListSubheader>

        <Divider />

        {group.items.map((item) => {
          return (
            <Fragment key={`item-${type}-${item.uuid}`} >
              <DefinitionListItem
                item={item}
                type={type as EStepKey}
              />
              <Divider />
            </Fragment>
          )
        })}
      </ul>
    </li>
  )
}