import type { ReactNode, CSSProperties, ComponentType, ComponentProps } from 'react'

import { Span } from '@GBC/components/Text'
import MuiButton from '@mui/material/Button'
import { useJoinSx } from '@GBC/hooks/theme/useJoinSx'

export type TButton = ComponentProps<typeof MuiButton> & {
  text?:ReactNode
  textSx?:CSSProperties
  iconSx?:CSSProperties
  Icon?:ComponentType<any>
}

const styles = {
  text: {},
  button: {padding: `6px 12px 6px 6px`},
  icon: {marginRight: `5px`, fontSize: `20px`},
}


export const Button = (props:TButton) => {
  const {
    text,
    Icon,
    textSx,
    iconSx,
     children,
     ...rest
  } = props

  return (
    <MuiButton {...rest} >

      {Icon && (
        <Icon
          className='gb-button-icon'
          sx={[styles.icon, iconSx]}
        />
      ) || null}
      {text && (
        <Span
          className='gb-button-text'
          sx={[styles.text, textSx as CSSProperties]}
        >
          {text}
        </Span>
      ) || null}

      {children}
    </MuiButton>
  )
}