import type { ComponentProps } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { useState } from 'react'
import { ESectionType } from '@GBR/types'
import { Input } from '@gobletqa/components'
import { ExpressionMenu } from './ExpressionMenu'
import { exists, emptyArr } from '@keg-hub/jsutils'
import {
  sharedLabelProps,
  sharedInputStyles,
  sharedHelperTextProps,
} from '../Shared'

export type TExpInput = ComponentProps<typeof Input> & {
  step: TRaceStep
  expression:TExpPart
  parent:TRaceStepParent
  disabled:boolean
  value:string|number
  items?:TMenuItem[]
}

const inputProps = {
  ...sharedLabelProps,
  ...sharedHelperTextProps,
  inputSx: sharedInputStyles
}

/**
 * **NOTICE** - Menu Item definitions are in the main frontend (vite) app
 * Look at file `src/hooks/race/ueContentMenu.ts`
 */
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