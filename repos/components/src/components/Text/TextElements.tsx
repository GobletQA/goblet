import type { ComponentProps } from 'react'
import { Text } from './Text'

export type TTextEl = ComponentProps<typeof Text>

export const H2 = (props:TTextEl) => <Text component='h2' {...props} />
export const H3 = (props:TTextEl) => <Text component='h3' {...props} />
export const H4 = (props:TTextEl) => <Text component='h4' {...props} />
export const H5 = (props:TTextEl) => <Text component='h5' {...props} />
export const H6 = (props:TTextEl) => <Text component='h6' {...props} />
export const Paragraph = (props:TTextEl) => <Text component='p' {...props} />
export const Span = (props:TTextEl) => <Text component='span' {...props} />


