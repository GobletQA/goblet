import type { ComponentProps } from 'react'
import type { TMenuItem } from '@gobletqa/components'
import type { TExpPart, TStepParentAst, TStepAst } from '@GBR/types'

import { useMemo } from 'react'
import { ExpressionMenu } from './ExpressionMenu'
import { selectFromBrowser } from '@GBR/actions/step/selectFromBrowser'
import {
  useInline,
  AutoInput,
  SelectDragIcon,
  ReflectHorIcon,
} from '@gobletqa/components'


const expressionProps = {
  label: `Type`,
  required: true,
  name: `step-expression-auto-input`,
  textFieldProps: {
    placeholder: `Select from list...`,
  },
}

export type TExpAutoInput = ComponentProps<typeof AutoInput> & {
  name?:string
  label?:string
  required?:boolean
  step: TStepAst
  expression:TExpPart
  parent:TStepParentAst
}

const useItems = (onClick:() => void) => {
  return useMemo(() => {
    return [
      {
        onClick,
        Icon: SelectDragIcon,
        text: `From Browser`,
      },
      {
        Icon: ReflectHorIcon,
        onClick:() => {
          console.log(`------- From Alias -------`)
        },
        text: `From Alias`,
      },
    ] as TMenuItem[]
  }, [])
}

export const ExpAutoInput = (props:TExpAutoInput) => {

  const {
    step,
    parent,
    onChange,
    expression,
    ...rest
  } = props

  const onClick = useInline(async () => {
    const data = await selectFromBrowser(parent, step, expression)
    onChange?.({target: { value: data.target }}, )
  })

  const items = useItems(onClick)

  return (
    <AutoInput
      {...expressionProps}
      {...rest}
      onChange={onChange}
      decor={{
        items,
        Component: ExpressionMenu
      }}
    />
  )
  
}