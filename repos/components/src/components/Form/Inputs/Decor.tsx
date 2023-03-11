import type { CSSProperties } from 'react'
import { TInputDecor } from '@GBC/types'
import InputAdornment from '@mui/material/InputAdornment'

export const Decor = (props:TInputDecor) => {
  const {
    sx,
    active,
    children,
    adornmentProps,
    Component:DecorComp,
    decorPos=`start` as any,
    pos=decorPos,
    ...decorProps
  } = props

  return (
    <InputAdornment
      position={pos}
      {...adornmentProps}
      sx={[
        {
          display: `flex`,
          position: `relative`,
          justifyContent: `center`
        },
        sx as CSSProperties,
        adornmentProps?.sx as CSSProperties,
      ]}
    >
      {
        DecorComp
          ? (<DecorComp {...decorProps} active={active} children={children} />)
          : children || null
      }
    </InputAdornment>
  )
  
}