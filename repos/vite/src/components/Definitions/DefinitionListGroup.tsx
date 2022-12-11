import type { EStepKey, TDefGroup } from '@types'

import { Fragment } from 'react'
import Divider from '@mui/material/Divider'
import { DefListSubheader } from './Definitions.styled'
import { DefinitionListItem } from './DefinitionListItem'

export type TDefinitionListGroup = {
  type:EStepKey
  group:TDefGroup
}

const keys = {} as any

export const DefinitionListGroup = (props:TDefinitionListGroup) => {
  const {
    type,
    group
  } = props

  const section = `section-${type}`

  return (
    <li className={section} >
      <ul className={`${section}-list-items`} >
        <DefListSubheader>
          {group.group}
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