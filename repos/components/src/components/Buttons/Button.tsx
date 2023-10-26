

import type {
  ReactNode,
  ForwardedRef,
  CSSProperties,
  ComponentType,
  ComponentProps,
} from 'react'

import { forwardRef } from 'react'
import { Span } from '@GBC/components/Text'
import MuiButton from '@mui/material/Button'
import { TooltipHoc } from '@GBC/hocs/TooltipHoc'
import { inheritStyles } from '@GBC/styles/styles'
import { emptyObj, omitKeys } from '@keg-hub/jsutils'
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
  Icon?:ComponentType<any>|ReactNode
  iconProps?:Record<string, any>|null|undefined
}

const styles = {
  text: inheritStyles,
  button: {padding: `6px 12px 6px 6px`},
  icon: {marginRight: `5px`, fontSize: `20px`},
}


const ButtonComp = forwardRef((props:TButton, ref:ForwardedRef<HTMLButtonElement>) => {
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
                  className='gb-button-icon'
                  {...(iconProps || emptyObj)}
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

export const Button = TooltipHoc(ButtonComp)