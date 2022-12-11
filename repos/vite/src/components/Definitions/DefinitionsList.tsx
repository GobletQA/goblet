import type { EStepKey, TDefGroups } from '@types'

import { DefsList } from './Definitions.styled'
import { DefinitionListGroup } from './DefinitionListGroup'

export type TDefinitionsList = {
  definitions: TDefGroups
}

export const DefinitionsList = (props:TDefinitionsList) => {
  const { definitions } = props
  const { lookup, all, ...defTypes } = definitions

  return (
    <DefsList subheader={<li />}>
      {Object.entries(defTypes).map(([type, group]) => {
        return (
          <DefinitionListGroup
            group={group}
            type={type as EStepKey}
            key={`section-${type}`}
          />
        )
      })}
    </DefsList>
  )
}
