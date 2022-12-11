import type { EStepKey, TDefGroup } from '@types'

import Divider from '@mui/material/Divider'
import { DefListSubheader } from './Definitions.styled'
import { DefinitionListItem } from './DefinitionListItem'

export type TDefinitionListGroup = {
  type:EStepKey
  group:TDefGroup
}

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

        {group.items.map((item) => (
          <>
            <DefinitionListItem
              item={item}
              type={type as EStepKey}
              key={`item-${type}-${item.uuid}`}
            />
            <Divider />
          </>
        ))}
      </ul>
    </li>
  )
}