import type { TStepDef } from '@ltipton/parkin'
import type { TExpPart, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { ESplitType, StepHeaderChunk } from './StepHeaderChunk'

export type TStepHeaderSplit = {
  step: TRaceStep
  expressions?:TExpPart[]
}

const useSplitStep = (props:TStepHeaderSplit) => {
  const { step, expressions } = props

  return useMemo(() => {
    return expressions
      ? expressions.reduce((acc, exp) => {

          const [type, remaining] = acc.pop() || [ESplitType.text, step.step]
          if(type === ESplitType.expression) return acc
          
          // Split the remaining step string text by the current match
          const [prefix, ...rest] = remaining.split(exp.match)
          const postfix = rest.join(exp.match)

          const key = acc.length
          /**
          * The order of parts added to the acc array is **IMPORTANT**
          * Add the first part of the string before the expression
          * Then add the expression
          * Finally, add the ending
          * Later we rebuild the string following the same order
          * 
          * Each item is an array of [type, value, key]
          * The type is used to know when component to use to render the value
          * The key is needed because of reacts requirement around array 
          */
          acc.push([ESplitType.text, prefix, `${key}-prefix`])
          
          !exp.value
          ? acc.push([ESplitType.placeholder, exp.match, `${key}-placeholder`])
          : acc.push([ESplitType.expression, exp.match, `${key}-expression`])
          acc.push([ESplitType.text, postfix, `${key}-postfix`])

          return acc
        }, [] as string[][]).filter(Boolean)
      : [[ESplitType.text, step.step, `empty-${step.uuid}`]]
  }, [step.step])
}

export const StepHeaderSplit = (props:TStepHeaderSplit) => {
  const { step } = props
  const split = useSplitStep(props)

  return (
    <>
      {split.map(([type, content, key]) => {
        return (
          <StepHeaderChunk
            key={key}
            type={step.type}
            children={content}
            part={type as ESplitType}
          />
        )
      })}
    </>
  )
}