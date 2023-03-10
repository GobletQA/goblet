import type { ComponentProps } from 'react'
import type { TStepAst } from '@ltipton/parkin'
import type { TMenuItem } from '@gobletqa/components'
import type { TExpPart, TStepParentAst } from '@GBR/types'

import { useState } from 'react'
import { ESectionType } from '@GBR/types'
import { Input } from '@gobletqa/components'
import { ExpressionMenu } from './ExpressionMenu'
import { exists, emptyArr } from '@keg-hub/jsutils'
import { sharedInputStyles, sharedLabelProps } from '../Shared'

export type TExpInput = ComponentProps<typeof Input> & {
  step: TStepAst
  expression:TExpPart
  parent:TStepParentAst
  disabled:boolean
  value:string|number
  items?:TMenuItem[]
}

const inputProps = {
  ...sharedLabelProps,
  inputSx: sharedInputStyles
}

export const ExpInput = (props:TExpInput) => {
  const {
    step,
    parent,
    value,
    onBlur,
    expression,
    defaultValue,
    items=emptyArr,
    ...rest
  } = props

  const [decorInputProps, setDecorInputProps] = useState<Partial<ComponentProps<typeof Input>>>({})

  return (
    <Input
      {...inputProps}
      {...rest}
      {...decorInputProps}
      onBlur={onBlur}
      value={!exists(value) && !exists(defaultValue) ? `` : value}
      decor={{
        items,
        gran: parent,
        parent: step,
        onChange: onBlur,
        active: expression,
        Component: ExpressionMenu,
        type:ESectionType.expression,
        context: ESectionType.expression,
        setInputProps:setDecorInputProps,
      }}
    />
  )
}