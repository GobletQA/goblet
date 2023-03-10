import type { TTextRef } from './Text'
import type { ComponentProps } from 'react'

import { Text } from './Text'
import { forwardRef } from 'react'

export type TTextEl = ComponentProps<typeof Text>

export const H1 = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text variant='h1' {...props} ref={ref} />
))
export const H2 = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text variant='h2' {...props} ref={ref} />
))
export const H3 = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text variant='h3' {...props} ref={ref} />
))
export const H4 = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text variant='h4' {...props} ref={ref} />
))
export const H5 = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text variant='h5' {...props} ref={ref} />
))
export const H6 = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text variant='h6' {...props} ref={ref} />
))
export const Paragraph = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text component='p' {...props} ref={ref} />
))
export const Span = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text component='span' {...props} ref={ref} />
))
export const Label = forwardRef((props:TTextEl, ref:TTextRef) => (
  <Text component='label' {...props} ref={ref} />
))

export {
  Paragraph as P
}

