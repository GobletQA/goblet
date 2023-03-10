import type { TStepAst, TStepDef } from '@ltipton/parkin'
import type { TExpPart, TStepParentAst } from '@GBR/types'

import { ChangeEvent } from 'react'

import { ExpInput } from './ExpInput'
import { capitalize } from '@keg-hub/jsutils'
import { useInline, Tooltip } from '@gobletqa/components'
import { ExpressionKindMap } from './ExpressionKindMap'
import { removeQuotes } from '@GBR/utils/helpers/removeQuotes'
import { ExpGridItem, ExpressionInfoText } from './Expression.styled'

export type TExpression = {
  def:TStepDef
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

const ExpressionInfo = (props:TExpression) => {
  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={props.expression.description}
    >
      <ExpressionInfoText>
        {props.expression.description}
      </ExpressionInfoText>
    </Tooltip>
  )
}

export const Expression = (props:TExpression) => {
  const {
    step,
    parent,
    expression
  } = props

  const onBlur = useExpressionChange(props)
  const Input = ExpressionKindMap[expression.kind || expression.paramType] || ExpInput

  return (
    <ExpGridItem xs={12} sm >
      <Input
        step={step}
        parent={parent}
        onBlur={onBlur}
        expression={expression}
        value={expression.value}
        type={expression.paramType}
        placeholder={expression.example}
        helperText={<ExpressionInfo {...props} />}
        label={capitalize(expression.kind || expression.paramType)}
      />
    </ExpGridItem>
  )
}