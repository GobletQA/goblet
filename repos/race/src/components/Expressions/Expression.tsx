import type { ChangeEvent } from 'react'
import type { TStepDef } from '@ltipton/parkin'
import type { TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { ExpInput } from './ExpInput'
import { capitalize } from '@keg-hub/jsutils'
import { ExpressionKindMap } from './ExpressionKindMap'
import { ExpressionNoQuoteTypes } from '@GBR/constants'
import { useInline, Tooltip } from '@gobletqa/components'
import { removeQuotes } from '@GBR/utils/helpers/removeQuotes'
import { ExpGridItem, ExpressionInfoText } from './Expression.styled'

export type TExpression = {
  def:TStepDef
  step: TRaceStep
  expression:TExpPart
  parent:TRaceStepParent
  onChange:(step:TRaceStep, old?:TRaceStep) => void
}

const numberTypes = Object.values(ExpressionNoQuoteTypes)

const getFixes = (
  step:string,
  expression:TExpPart,
  noQuotes:boolean
) => {
  const { index } = expression
  /**
   * If a value already exists for the expression
   * The use it to calculate the end of the string
   * If no value exists, then use the match text from the expression
   * In cases where we wrap the expression in quotes, we add 2 to the length
   * Only wrap for non-numbers
   */
  const postLength = expression?.value
    ? noQuotes
      ? expression.value.length
      : `${expression.value}`.length + 2
    : expression.text.length

  return {
    prefix:step.substring(0, index),
    postfix: step.substring(index + postLength)
  }
}

const useExpressionChange = (props:TExpression) => {
  const {
    step,
    onChange,
    expression,
  } = props

  return useInline((evt:ChangeEvent<HTMLInputElement>) => {
    const value = removeQuotes(evt.target.value || ``)
    if(value === expression.value) return

    const { text } = expression
    // Check if quotes should be added
    const noQuotes = Boolean(numberTypes.find(type => type === expression.type))

    const { postfix, prefix } = getFixes(step.step, expression, noQuotes)

    const replace = value ? noQuotes ? value : `"${value}"` : text
    const result = `${prefix}${replace}${postfix}`

    onChange?.({...step, step: result}, step)

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

/**
 * **NOTICE** - Menu Item definitions are in the main frontend (vite) app
 * Look at file `src/hooks/race/ueContentMenu.ts`
 */
export const Expression = (props:TExpression) => {
  const {
    step,
    parent,
    expression
  } = props

  const onBlur = useExpressionChange(props)
  const Input = ExpressionKindMap[expression.kind || expression.paramType] || ExpInput
  const inputType = expression.paramType === `int` || `float` ? `number` : expression.paramType

  return (
    <ExpGridItem xs={12} sm >
      <Input
        step={step}
        parent={parent}
        onBlur={onBlur}
        type={inputType}
        expression={expression}
        value={expression.value}
        placeholder={`${expression.example}`}
        helperText={<ExpressionInfo {...props} />}
        label={capitalize(expression.kind || expression.paramType)}
      />
    </ExpGridItem>
  )
}