import { TInputDecor } from '@types'
import InputAdornment from '@mui/material/InputAdornment'
import type { ComponentType, ReactNode } from 'react'

export const Decor = (props:TInputDecor) => {
  const {
    active,
    labelPos,
    pos=`start`,
    iconProps,
    buttonProps,
    adornmentProps,
    Component:DecorComp,
    ...decorProps
  } = props

  return (
    <InputAdornment
      position={pos}
      {...adornmentProps}
      sx={[
        {
          display: `flex`,
          minWidth: `55px`,
          maxWidth: `55px`,
          position: `relative`,
          justifyContent: `center`
        },
        adornmentProps?.sx
      ]}
    >
      {DecorComp && (<DecorComp {...decorProps} />)}
    </InputAdornment>
  )
  
}