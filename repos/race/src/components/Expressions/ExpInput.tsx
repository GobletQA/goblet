import type { CSSProperties, ComponentProps } from 'react'
import { Input } from '@gobletqa/components'
import type { TExpPart, TStepParentAst, TStepAst } from '@GBR/types'


export type TExpInput = ComponentProps<typeof Input> & {
  step: TStepAst
  expression:TExpPart
  parent:TStepParentAst
  disabled:boolean
  value:string|number
}

const inputProps = {
  labelSx: {
    fontSize: `12px`,
  },
  labelWrapSx: {
    // marginBottom: `5px !important`
  },
  inputSx: {
    minHeight: `35px`,
    [`& .MuiTextField-root`]: {
      height: `35px`,
      minHeight: `35px`,
    },
    [`& .MuiInputBase-root`]: {
      height: `35px`,
      minHeight: `35px`,
      
      [`& input`]: {
        height: `35px`,
        fontSize: `12px`,
      },
      [`& input::placeholder`]: {
        fontSize: `12px`
      }
    },
  } as CSSProperties
}

export const ExpInput = (props:TExpInput) => {
  const {
    step,
    parent,
    expression,
    value,
    ...rest
  } = props

  return (
    <Input
      {...inputProps}
      {...rest}
      defaultValue={value || ``}
    />
  )
}