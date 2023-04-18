import { cls } from '@keg-hub/jsutils'
import { colors } from '@gobletqa/components'
import {
  StepHeaderExp,
  StepHeaderPart,
  StepHeaderType,
  StepHeaderMissing,
  StepHeaderPlaceholder,
} from './StepHeader.styled'

export enum ESplitType {
  text=`text`,
  type=`type`,
  empty=`empty`,
  missing=`missing`,
  expression=`expression`,
  placeholder=`placeholder`,
}

type TStepSplit = {
  type:string
  part:ESplitType
  children?:string
  missingDef?:boolean
}

const StepHeaderComponents = {
  [ESplitType.text]: StepHeaderPart,
  [ESplitType.type]: StepHeaderType,
  [ESplitType.empty]: StepHeaderType,
  [ESplitType.expression]: StepHeaderExp,
  [ESplitType.missing]: StepHeaderMissing,
  [ESplitType.placeholder]: StepHeaderPlaceholder,
}

const missingStyle = {
  [ESplitType.type]: {
    marginLeft: `3px`,
    marginRight: `3px`,
    color: colors.red14
  }
}

export const StepHeaderChunk = (props:TStepSplit) => {
  const { type, part, children, missingDef } = props
  const Component = missingDef
    ? StepHeaderComponents[ESplitType.missing]
    : StepHeaderComponents[part as keyof typeof StepHeaderComponents]

  const sx = missingDef ? missingStyle[part as keyof typeof missingStyle] : undefined

  return Component && (
    <Component
      sx={sx}
      className={cls(
        `gb-section-header-chunk`,
        `gb-step-header-${part}`,
        type && `gb-section-header-${type}`,
        missingDef && `gb-section-header-missing-definition`
      )}
    >
      {children}
    </Component>
  ) || null
}



