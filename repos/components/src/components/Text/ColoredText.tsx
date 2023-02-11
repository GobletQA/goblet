import type { CSSProperties, ComponentProps } from 'react'

import { colors } from '@GBC/theme'
import { Span } from '@GBC/components/Text'

export const GreenText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={[props.sx, { color: colors.green10 }] as CSSProperties[]}
  />
)

export const YellowText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={[props.sx, { color: colors.yellow10 }] as CSSProperties[]}
  />
)

export const PurpleText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={[props.sx, { color: colors.purple10 }] as CSSProperties[]}
  />
)