import type { TStepAst, TStepDef } from '@ltipton/parkin'
import type { TExpPart, TStepParentAst } from '@GBR/types'

import { ChangeEvent } from 'react'

import { ExpInput } from './ExpInput'
import { capitalize } from '@keg-hub/jsutils'
import { ExpGridItem } from './Expression.styled'
import { useInline } from '@gobletqa/components'
import { ExpressionKindMap } from './ExpressionKindMap'
import { removeQuotes } from '@GBR/utils/helpers/removeQuotes'

export type TExpression = {
  def:TStepDef
  width:number
  step: TStepAst
  expression:TExpPart
  parent:TStepParentAst
  onChange:(step:TStepAst, old?:TStepAst) => void
}


const useExpressionChange = (props:TExpression) => {
  const {
    def,
    step,
    onChange,
    expression,
  } = props

  return useInline((evt:ChangeEvent<HTMLInputElement>) => {
    const value = removeQuotes(evt.target.value || ``)

    if(value === expression.value) return

    const { text, index } = expression
    
    // TODO - Check the value type, and only add 2 when the type is a string
    // For numbers, we don't want to add quotes to it

    // If a value already exists for the expression
    // The use it to calculate the end of the string
    // If no value exists, then use the match text from the expression
    // Because we also wrap the expression in quotes, we add 2 to the length
    const postLength = expression?.value
      ? `${expression.value}`.length + 2
      : text.length

    const prefix = step.step.substring(0, index)
    const postfix = step.step.substring(index + postLength)

    const replace = value ? `"${value}"` : text
    const result = `${prefix}${replace}${postfix}`

    const updated = {...step, step: result}
    onChange?.(updated, step)

  })
}

export const Expression = (props:TExpression) => {
  const {
    step,
    width,
    parent,
    expression
  } = props

  const onChange = useExpressionChange(props)
  const Input = ExpressionKindMap[expression.kind || expression.paramType] || ExpInput

  return (
    <ExpGridItem
      xs={12}
      sm={width}
    >
      <Input
        step={step}
        parent={parent}
        expression={expression}
        onChange={onChange}
        value={expression.value}
        type={expression.paramType}
        placeholder={expression.example}
        helperText={expression.description}
        label={capitalize(expression.kind || expression.paramType)}
      />
    </ExpGridItem>
  )
}