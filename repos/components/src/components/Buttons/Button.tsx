import type { SvgIconProps } from '@mui/material'
import type { ForwardedRef, ReactNode, CSSProperties, ComponentType, ComponentProps } from 'react'

import { forwardRef } from 'react'
import { Span } from '@GBC/components/Text'
import MuiButton from '@mui/material/Button'
import { omitKeys } from '@keg-hub/jsutils'
import { isValidFuncComp } from '@GBC/utils/components/isValidFuncComp'

export const BtnRmKeys = [
  `tooltip`,
  `closeMenu`,
  `featureKey`,
  `dividerTop`,
  `closeParent`,
  `onCloseMenu`,
  `dividerBottom`,
  `iconContainerSx`,
]

export type TButton = ComponentProps<typeof MuiButton> & {
  text?:ReactNode
  textSx?:CSSProperties
  iconSx?:CSSProperties
  iconProps?:SvgIconProps
  Icon?:ComponentType<any>|ReactNode
}

const styles = {
  text: {
    font: `inherit`,
    fontSize: `inherit`,
    fontWeight: `inherit`,
    fontFamily: `inherit`,
    lineHeight: `inherit`,
    letterSpacing: `inherit`,
  },
  button: {padding: `6px 12px 6px 6px`},
  icon: {marginRight: `5px`, fontSize: `20px`},
}


export const Button = forwardRef((props:TButton, ref:ForwardedRef<HTMLButtonElement>) => {
  const {
    text,
    Icon,
    textSx,
    iconSx,
    iconProps,
     children,
     ...rest
  } = props

  return (
    <MuiButton
      {...omitKeys<Partial<TButton>>(rest, BtnRmKeys)}
      ref={ref}
    >
      <>
        {Icon && (
          isValidFuncComp(Icon)
            ? (
                <Icon
                  {...iconProps}
                  className='gb-button-icon'
                  sx={[styles.icon, iconProps?.sx, iconSx]}
                />
              )
            : {Icon}
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
      </>
    </MuiButton>
  )
})