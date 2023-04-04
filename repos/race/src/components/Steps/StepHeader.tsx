import type { TStepDef } from '@ltipton/parkin'
import type { TExpPart, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { StepHeaderText, StepHeaderType } from './Steps.styled'
import { capitalize, cls } from '@keg-hub/jsutils'
import { ESplitType, StepHeaderChunk } from './StepHeaderChunk'

export type TStepHeader = {
  def:TStepDef
  step: TRaceStep
  expressions:TExpPart[]
}


const ExpressionHeader = (props:TStepHeader) => {
  const { step, expressions } = props

  const split = useMemo(() => {
    return expressions.reduce((acc, exp) => {

      // if(!exp.value) return acc

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
  }, [step.step])

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

const HeaderType = (props:TStepHeader & {isEmpty:boolean}) => {
  const { step } = props

  return !step?.step?.trim()
    ? (
        <StepHeaderType
          className={cls(
            `gb-step-header-empty`,
            `gb-section-header-empty`,
            `gb-section-header-chunk`,
          )}
        >
          Empty Step
        </StepHeaderType>
      )
    : (
        <StepHeaderType
          className={cls(
            `gb-step-header-type`,
            `gb-section-header-type`,
            `gb-section-header-chunk`,
            step.type && `gb-section-header-${step.type}`
          )}
        >
          {capitalize(step.type)}
        </StepHeaderType>
      )
}

export const StepHeader = (props:TStepHeader) => {
  const { step, def, expressions } = props
  const isEmpty = !Boolean(step?.step?.trim())
 
  return (
    <StepHeaderText>
      <HeaderType
        {...props}
        isEmpty={isEmpty}
      />
      {!isEmpty && (<ExpressionHeader {...props} />) || null}
    </StepHeaderText>
  )
}