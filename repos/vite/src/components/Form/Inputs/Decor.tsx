import { InputDecor } from '@types'
import InputAdornment from '@mui/material/InputAdornment'
import type { ComponentType, ReactNode } from 'react'


export type TDecor = InputDecor & {
  Component: ComponentType<any>
}

export const Decor = (props:TDecor) => {
  const {
    pos=`start`,
    Component:DecorComp,
    ...decorProps
  } = props

  return (
    <InputAdornment position={pos}>
      <DecorComp {...decorProps} />
    </InputAdornment>
  )
  
}