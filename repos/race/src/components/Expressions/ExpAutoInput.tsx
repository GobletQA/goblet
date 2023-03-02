import type { ComponentProps } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TExpPart, TStepParentAst, TStepAst } from '@GBR/types'

import { useState } from 'react'
import { ESectionType } from '@GBR/types'
import { emptyArr } from '@keg-hub/jsutils'
import { ExpressionMenu } from './ExpressionMenu'
import { AutoInput } from '@gobletqa/components'
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
  step: TStepAst
  required?:boolean
  items?:TMenuItem[]
  expression:TExpPart
  parent:TStepParentAst
}


export const ExpAutoInput = (props:TExpAutoInput) => {

  const {
    step,
    parent,
    onChange,
    expression,
    items=emptyArr,
    ...rest
  } = props

  const [inputProps, setInputProps] = useState<Partial<ComponentProps<typeof AutoInput>>>({})

  return (
    <AutoInput
      {...expressionProps}
      {...rest}
      {...inputProps}
      onChange={onChange}
      decor={{
        items,
        onChange,
        gran: parent,
        parent: step,
        setInputProps,
        active: expression,
        Component: ExpressionMenu,
        type:ESectionType.expression,
        context: ESectionType.expression,
      }}
    />
  )
  
}