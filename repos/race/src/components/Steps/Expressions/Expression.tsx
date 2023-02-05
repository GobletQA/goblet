import { ChangeEvent } from 'react'
import type { TExpPart, TStepParentAst, TStepDef, TStepAst } from '@GBR/types'
import type { TAutoOpt } from '@gobletqa/components'

import { ExpInput } from './ExpInput'
import { capitalize } from '@keg-hub/jsutils'
import { StepGridItem } from '../Steps.styled'
import { useInline } from '@gobletqa/components'
import { ExpressionKindMap } from './ExpressionKindMap'
import { removeQuotes } from '@GBR/utils/helpers/removeQuotes'


export type TExpression = {
  def:TStepDef
  width:number
  step: TStepAst
  parent:TStepParentAst
  expression:TExpPart
  onChange:(step:TStepAst) => void
}


const useExpressionChange = (props:TExpression) => {
  const {
    step,
    onChange,
    expression
  } = props

  return useInline((evt:ChangeEvent<HTMLInputElement>) => {
    const value = removeQuotes(evt.target.value || ``)
    const { input, text, index } = expression

    const prefix = input.substring(0, index)
    const postfix = input.substring(index + text.length)

    const replace = value ? `"${value}"` : text
    const result = `${prefix}${replace}${postfix}`

    onChange?.({...step, step: result})

  })
}

export const Expression = (props:TExpression) => {
  const {
    width,
    expression
  } = props

  const onChange = useExpressionChange(props)
  const Input = ExpressionKindMap[expression.kind || expression.paramType] || ExpInput

  return (
    <StepGridItem
      xs={12}
      sm={width}
    >
      <Input
        onChange={onChange}
        value={expression.value}
        type={expression.paramType}
        placeholder={expression.example}
        helperText={expression.description}
        label={capitalize(expression.kind || expression.paramType)}
      />
    </StepGridItem>
  )
}