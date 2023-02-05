import type { ComponentProps } from 'react'
import type { TMenuItem } from '@gobletqa/components'

import { ExpressionMenu } from './ExpressionMenu'
import { SelectDragIcon, ReflectHorIcon, AutoInput } from '@gobletqa/components'


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
}

const items:TMenuItem[] = [
  {
    Icon: SelectDragIcon,
    onClick:() => {
      console.log(`------- From Browser -------`)
    },
    text: `From Browser`,
  },
  {
    Icon: ReflectHorIcon,
    onClick:() => {
      console.log(`------- From Alias -------`)
    },
    text: `From Alias`,
  },
]


export const ExpAutoInput = (props:TExpAutoInput) => {
  
  const {
    
  } = props
  
  return (
    <AutoInput
      {...expressionProps}
      {...props}
      decor={{
        items,
        Component: ExpressionMenu
      }}
    />
  )
  
}