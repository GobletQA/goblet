import type { TRuleAst, TRaceFeature } from '@GBR/types'

import { Rule } from './Rule'
import { Sections } from '../Shared'
import { ESectionType } from '@GBR/types'
import { useInline } from '@gobletqa/components'
import { addRule } from '@GBR/actions/rule/addRule'

export type TRules = {
  rules?:TRuleAst[]
  parent:TRaceFeature
} 

export const Rules = (props:TRules) => {

  const { rules, parent } = props
  const onAdd = useInline(() => addRule())

  return (
    <Sections
      onAdd={onAdd}
      showAdd={true}
      parent={parent}
      type={ESectionType.rule}
    >
    {
      rules?.map(rule => {
        return (
          <Rule
            rule={rule}
            parent={parent}
            key={`${parent.uuid}-rule-${rule.uuid}`}
          />
        )
      })
    }
    </Sections>
  )
}