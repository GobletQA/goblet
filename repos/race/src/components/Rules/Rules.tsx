import type { TSection } from '../Shared'
import type { TRuleAst, TRaceFeature } from '@GBR/types'

import { Rule } from './Rule'
import { Sections } from '../Shared'
import { ESectionType } from '@GBR/types'
import { useInline } from '@gobletqa/components'

export type TRules = {
  rules?:TRuleAst[]
  parent:TRaceFeature
} 

export const Rules = (props:TRules) => {

  const { rules, parent } = props
  const onAdd = useInline(() => {})
  const onAddScenario = useInline(() => {})

  return (
    <Sections
      onAdd={onAdd}
      showAdd={true}
      parent={parent}
      type={ESectionType.rule}
      items={
        rules?.map(rule => {
          return {
            parent,
            show: true,
            onAdd: onAddScenario,
            initialExpand: false,
            type: ESectionType.rule,
            className: 'gr-rule-section',
            id:`${parent.uuid}-rule-${rule.uuid}`
            // children: 
          } as TSection
        })
      }
    />
  )
}