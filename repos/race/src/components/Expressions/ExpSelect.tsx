import type { ComponentProps } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TExpPart, TRaceStepParent, TRaceStep } from '@GBR/types'

import { useState } from 'react'
import { ESectionType } from '@GBR/types'
import { Select } from '@gobletqa/components'
import { ExpressionMenu } from './ExpressionMenu'
import { exists, emptyArr } from '@keg-hub/jsutils'
import { useExpMergeOpts } from '@GBR/hooks/expressions/useExpMergeOpts'
import {
  sharedLabelProps,
  sharedInputStyles,
  sharedHelperTextProps,
} from '../Shared'

export type TExpSelect = ComponentProps<typeof Select> & {
  step:TRaceStep
  disabled:boolean
  items?:TMenuItem[]
  value:string|number
  expression:TExpPart
  parent:TRaceStepParent
  defaultValue:string|number
}

const selectProps = {
  ...sharedLabelProps,
  ...sharedHelperTextProps,
  inputSx: sharedInputStyles
}

/**
 * **NOTICE** - Menu Item definitions are in the main frontend (vite) app
 * Look at file `src/hooks/race/ueContentMenu.ts`
 */
export const ExpSelect = (props:TExpSelect) => {
  const {
    step,
    value,
    parent,
    onChange,
    expression,
    defaultValue,
    items=emptyArr,
    ...rest
  } = props

  const {
    options,
    setRemoteOptions
  } = useExpMergeOpts({ expression })

  const [
    decorInputProps,
    setDecorInputProps
  ] = useState<Partial<ComponentProps<typeof Select>>>({})

  const decor = expression.decor !== false
    ? {
        items,
        gran: parent,
        parent: step,
        active: expression,
        onChange: onChange,
        Component: ExpressionMenu,
        type:ESectionType.expression,
        setOptions: setRemoteOptions,
        context: ESectionType.expression,
        setInputProps:setDecorInputProps,
      }
    : undefined

  return (
    <Select
      {...selectProps}
      {...rest}
      {...decorInputProps}
      decor={decor}
      options={options}
      onChange={onChange}
      value={!exists(value) && !exists(defaultValue) ? `` : value}
    />
  )
}
