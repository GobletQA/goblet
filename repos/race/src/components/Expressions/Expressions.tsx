import type { TStepDef } from '@ltipton/parkin'
import type { TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { Expression } from './Expression'

export type TExpressions = {
  def:TStepDef
  step: TRaceStep
  parent:TRaceStepParent
  expressions:TExpPart[]
  onChange:(step:TRaceStep) => void
}

export const Expressions = (props:TExpressions) => {
  const {
    def,
    step,
    parent,
    onChange,
    expressions,
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