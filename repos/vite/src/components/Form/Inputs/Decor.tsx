import { TInputDecor } from '@types'
import InputAdornment from '@mui/material/InputAdornment'
import type { ComponentType, ReactNode } from 'react'

export const Decor = (props:TInputDecor) => {
  const {
    pos=`start`,
    active,
    Component:DecorComp,
    ...decorProps
  } = props

  return (
    <InputAdornment position={pos}>
      <DecorComp {...decorProps} />
    </InputAdornment>
  )
  
}