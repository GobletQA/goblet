import type { TRaceFeature } from '@GBR/types'
import type { TRuleAst } from '@ltipton/parkin'

import { Rule } from './Rule'
import { Sections } from '../Section'
import { ESectionType } from '@GBR/types'
import { useInline } from '@gobletqa/components'
import { addRule } from '@GBR/actions/rule/addRule'
import { generateId } from '@GBR/utils/helpers/generateId'

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
      parent={parent}
      showAdd={false}
      type={ESectionType.rule}
    >
    {
      rules?.map(rule => {
        const ruleId = generateId(parent, rule, ESectionType.rule)

        return (
          <Rule
            rule={rule}
            key={ruleId}
            ruleId={ruleId}
            parent={parent}
          />
        )
      })
    }
    </Sections>
  )
}