import type { ReactNode, ElementType } from 'react'
import type { EStepKey, TDefGroups } from '@types'

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
    <DefsList subheader={<li />}>
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
