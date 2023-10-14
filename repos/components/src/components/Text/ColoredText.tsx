import type { CSSProperties, ComponentProps } from 'react'

import { colors } from '@GBC/theme'
import { Span } from '@GBC/components/Text'
import { inheritStyles } from '@GBC/styles/styles'


export const GreenText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={[inheritStyles, props.sx, { color: colors.green10 }] as CSSProperties[]}
  />
)

export const YellowText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={[inheritStyles, props.sx, { color: colors.yellow10 }] as CSSProperties[]}
  />
)

export const PurpleText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={[inheritStyles, props.sx, { color: colors.purple10 }] as CSSProperties[]}
  />
)

export const RedText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={[inheritStyles, props.sx, { color: colors.red10 }] as CSSProperties[]}
  />
)

export const InText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={[inheritStyles, props.sx] as CSSProperties[]}
  />
)
