import type { TStepAst, TStepDef } from '@ltipton/parkin'
import type { TExpPart, TStepParentAst } from '@GBR/types'

import { Expression } from './Expression'

export type TExpressions = {
  def:TStepDef
  step: TStepAst
  parent:TStepParentAst
  expressions:TExpPart[]
  onChange:(step:TStepAst) => void
}

export const Expressions = (props:TExpressions) => {
  const {
    def,
    step,
    parent,
    onChange,
    expressions
  } = props

  return (
    <>
      {
        expressions.map(exp => {
          return (
            <Expression
              def={def}
              step={step}
              parent={parent}
              expression={exp}
              onChange={onChange}
              key={`${exp.index}-${exp.kind}`}
            />
          )
        })
      }
    </>
  )
}