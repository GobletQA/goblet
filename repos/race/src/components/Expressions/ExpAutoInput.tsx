import type { ComponentProps } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { useState } from 'react'
import { ESectionType } from '@GBR/types'
import { emptyArr } from '@keg-hub/jsutils'
import { AutoInput } from '@gobletqa/components'
import { ExpressionMenu } from './ExpressionMenu'
import { useExpMergeOpts } from '@GBR/hooks/expressions/useExpMergeOpts'
import {
  sharedLabelProps,
  sharedHelperTextProps,
  sharedAutoInputStyles,
} from '../Shared'

const expressionProps = {
  label: `Type`,
  required: true,
  name: `step-expression-auto-input`,
  textFieldProps: {
    placeholder: `Select from list...`,
  },
  ...sharedLabelProps,
  ...sharedHelperTextProps,
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
    onChange,
    expression,
    items=emptyArr,
    ...rest
  } = props

  const {
    options,
    setRemoteOptions
  } = useExpMergeOpts({ expression })
  const [decorInputProps, setDecorInputProps] = useState<Partial<ComponentProps<typeof AutoInput>>>({})

  return (
    <AutoInput
      freeSolo={true}
      {...expressionProps}
      {...rest}
      {...decorInputProps}
      options={options}
      onBlur={onBlur}
      decor={{
        items,
        gran: parent,
        parent: step,
        onChange: onBlur,
        active: expression,
        Component: ExpressionMenu,
        type:ESectionType.expression,
        setOptions: setRemoteOptions,
        setInputProps:setDecorInputProps,
        context: ESectionType.expression,
      }}
    />
  )
  
}