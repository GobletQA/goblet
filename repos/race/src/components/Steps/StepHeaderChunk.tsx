import { cls } from '@keg-hub/jsutils'
import {
  StepHeaderExp,
  StepHeaderPart,
  StepHeaderPlaceholder,
} from './Steps.styled'

export enum ESplitType {
  text=`text`,
  expression=`expression`,
  placeholder=`placeholder`
}

type TStepSplit = {
  type:string
  part:ESplitType
  children?:string
}

const StepHeaderComponents = {
  [ESplitType.text]: StepHeaderPart,
  [ESplitType.expression]: StepHeaderExp,
  [ESplitType.placeholder]: StepHeaderPlaceholder,
}

export const StepHeaderChunk = (props:TStepSplit) => {
  const { type, part, children } = props
  const Component = StepHeaderComponents[part as keyof typeof StepHeaderComponents]
  
  return Component && (
    <Component
      className={cls(
        `gb-section-header-chunk`,
        `gb-step-header-${part}`,
        type && `gb-section-header-${type}`
      )}
    >
      {children}
    </Component>
  ) || null
}



