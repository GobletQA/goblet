import type { TStepDef } from '@ltipton/parkin'
import type { TExpPart, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { capitalize, cls } from '@keg-hub/jsutils'
import { SectionHeaderType, SectionHeaderContent } from '../Section/SectionHeader.styled'
import {
  StepHeaderText,
  StepHeaderTextExp,
  StepHeaderTextPart,
  StepHeaderTextType,
} from './Steps.styled'

export type TStepHeader = {
  def:TStepDef
  step: TRaceStep
  expressions:TExpPart[]
}

enum ESplitType {
  text=`text`,
  expression=`expression`
}

type TStepSplit = {
  type:string
  children?:string
}

const StepDefHeaderText = (props:TStepSplit) => {
  const { type, children } = props
  return (
    <StepHeaderTextPart
      className={cls(
        `gb-step-header-text-content`,
        `gb-section-header-text-content`,
        type && `gb-section-header-text-content-${type}`
      )}
    >
      {children}
    </StepHeaderTextPart>
  )
}

const StepHeaderExpression = (props:TStepSplit) => {
  const { type, children } = props

  return (
    <StepHeaderTextExp
      className={cls(
        `gb-step-header-text-exp`,
        `gb-section-header-text-exp`,
        type && `gb-section-header-text-exp-${type}`
      )}
    >
      {children}
    </StepHeaderTextExp>
  )
}

const SplitMap = {
  [ESplitType.text]: StepDefHeaderText,
  [ESplitType.expression]: StepHeaderExpression,
}

const StepExpHeader = (props:TStepHeader) => {
  const { step, expressions } = props

  const split = useMemo(() => {
    return expressions.reduce((acc, exp) => {
      if(!exp.value) return acc

      const [type, remaining] = acc.pop() || [ESplitType.text, step.step]
      if(type === ESplitType.expression) return acc
      
      // Split the remaining step string text by the current match
      const [prefix, postfix] = remaining.split(exp.match)

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
      acc.push([ESplitType.expression, exp.match, `${key}-expression`])
      acc.push([ESplitType.text, postfix, `${key}-postfix`])

      return acc
    }, [] as string[][]).filter(Boolean)
  }, [step.step])

  return (
    <>
      {split.map(([type, content, key]) => {
        const Component = SplitMap[type as keyof typeof SplitMap]

        return (
          <Component
            key={key}
            type={type}
            children={content}
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
        <StepHeaderTextType
          className={cls(
            `gb-step-header-text-type`,
            `gb-section-header-text-empty`
          )}
        >
          Empty Step
        </StepHeaderTextType>
      )
    : (
        <StepHeaderTextType
          className={cls(
            `gb-step-header-text-type`,
            `gb-section-header-text-type`,
            step.type && `gb-section-header-text-${step.type}`
          )}
        >
          {capitalize(step.type)}
        </StepHeaderTextType>
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
      {
        isEmpty
          ? null
          : def?.match !== step?.step && expressions
            ? (<StepExpHeader {...props} />)
            : (<StepDefHeaderText children={step.step} type={step.type} />)
      }
    </StepHeaderText>
  )
}