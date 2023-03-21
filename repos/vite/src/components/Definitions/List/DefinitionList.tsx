import type { ReactNode, ElementType } from 'react'
import type { TDefGroups } from '@types'
import type { EStepKey } from '@ltipton/parkin'

import { DefsList } from './DefinitionList.styled'
import { DefinitionListGroup } from './DefinitionListGroup'

export type TDefinitionsList = {
  all?:boolean
  definitions: TDefGroups
  Header?:ElementType<any> | ReactNode
}

export const DefinitionList = (props:TDefinitionsList) => {
  const { Header, all, definitions } = props

  return (
    <DefsList subheader={<li className='gb-defs-list-sub-header' />}>
      {Object.entries(definitions).map(([type, group]) => {
        return type !== `all` || all
          ? (
              <DefinitionListGroup
                group={group}
                Header={Header}
                type={type as EStepKey}
                key={`section-${type}`}
              />
            )
          : null
      })}
    </DefsList>
  )
}
