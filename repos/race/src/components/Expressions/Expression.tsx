import type { TStepDef } from '@ltipton/parkin'
import type { TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { capitalize } from '@keg-hub/jsutils'
import { Tooltip } from '@gobletqa/components'
import { ExpGridItem, ExpressionInfoText } from './Expression.styled'


import { useExpressionInput } from '@GBR/hooks/expressions/useExpressionInput'
import { useExpressionChange } from '@GBR/hooks/expressions/useExpressionChange'
import { useExpressionOptions } from '@GBR/hooks/expressions/useExpressionOptions'

export type TExpression = {
  def:TStepDef
  step: TRaceStep
  expression:TExpPart
  parent:TRaceStepParent
  onChange:(step:TRaceStep, old?:TRaceStep) => void
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

  const expOps = useExpressionOptions(props)
  const onBlur = useExpressionChange(props, expOps)
  const { Input, inputType } = useExpressionInput(expression)
  const { value, options } = expOps

  return (
    <ExpGridItem xs={12} sm >
      <Input
        autoFocus
        step={step}
        parent={parent}
        onBlur={onBlur}
        type={inputType}
        options={options}
        value={value || null}
        expression={expression}
        placeholder={`${expression.example}`}
        helperText={<ExpressionInfo {...props} />}
        label={capitalize(expression.kind || expression.paramType)}
      />
    </ExpGridItem>
  )
}