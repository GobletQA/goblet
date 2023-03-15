import type { ComponentProps } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { useState } from 'react'
import { ESectionType } from '@GBR/types'
import { emptyArr } from '@keg-hub/jsutils'
import { AutoInput } from '@gobletqa/components'
import { ExpressionMenu } from './ExpressionMenu'
import { sharedAutoInputStyles, sharedLabelProps } from '../Shared'

const expressionProps = {
  label: `Type`,
  required: true,
  name: `step-expression-auto-input`,
  textFieldProps: {
    placeholder: `Select from list...`,
  },
  ...sharedLabelProps,
  sx: sharedAutoInputStyles
}

export type TExpAutoInput = ComponentProps<typeof AutoInput> & {
  name?:string
  label?:string
  step: TRaceStep
  required?:boolean
  items?:TMenuItem[]
  expression:TExpPart
  parent:TRaceStepParent
}


export const ExpAutoInput = (props:TExpAutoInput) => {

  const {
    step,
    parent,
    onBlur,
    expression,
    items=emptyArr,
    ...rest
  } = props

  const [decorInputProps, setDecorInputProps] = useState<Partial<ComponentProps<typeof AutoInput>>>({})

  return (
    <AutoInput
      {...expressionProps}
      {...rest}
      {...decorInputProps}
      onBlur={onBlur}
      decor={{
        items,
        gran: parent,
        parent: step,
        onChange: onBlur,
        active: expression,
        Component: ExpressionMenu,
        type:ESectionType.expression,
        setInputProps:setDecorInputProps,
        context: ESectionType.expression,
      }}
    />
  )
  
}