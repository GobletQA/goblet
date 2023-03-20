import type { TRaceRule, TRaceFeature } from '@GBR/types'

import { Rule } from './Rule'
import { Sections } from '../Section'
import { ESectionType } from '@GBR/types'
import { useInline } from '@gobletqa/components'
import { addRule } from '@GBR/actions/rule/addRule'

export type TRules = {
  rules?:TRaceRule[]
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

        return (
          <Rule
            rule={rule}
            key={rule.uuid}
            parent={parent}
            ruleId={rule.uuid}
          />
        )
      })
    }
    </Sections>
  )
}