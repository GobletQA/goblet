import type { TRuleAst, TRaceFeature } from '@GBR/types'

import { Rule } from './Rule'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'


export type TRules = {
  rules?:TRuleAst[]
  parent:TRaceFeature
} 

export const Rules = (props:TRules) => {

  const { rules, parent } = props

  return (
    <>
      {rules?.map(rule => {
        return (
          <Rule
            rule={rule}
            key={`${parent.uuid}-${rule.uuid}`}
          />
        )
      })}
      <AddItem
        parentId={parent.uuid}
        type={ESectionType.rule}
      />
    </>
  )
}