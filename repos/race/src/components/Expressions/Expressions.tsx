import type { TStepAst, TStepDef } from '@ltipton/parkin'
import type { TExpPart, TStepParentAst } from '@GBR/types'

import { useMemo } from 'react'
import { Expression } from './Expression'


export type TExpressions = {
  def:TStepDef
  step: TStepAst
  parent:TStepParentAst
  expressions:TExpPart[]
  onChange:(step:TStepAst) => void
}

const useInputWidth = (expressions:TExpPart[]) => {
  return useMemo(() => {
    const width = 9 / expressions.length

    return width > 6 ? 6 : width
  }, [expressions.length])
}

export const Expressions = (props:TExpressions) => {
  const {
    def,
    step,
    parent,
    onChange,
    expressions
  } = props

  const width = useInputWidth(expressions)

  return (
    <>
      {
        expressions.map(exp => {
          return (
            <Expression
              def={def}
              step={step}
              width={width}
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