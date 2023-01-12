import type { ComponentProps } from 'react'
import { Text } from './Text'

export type TTextEl = ComponentProps<typeof Text>

export const H1 = (props:TTextEl) => <Text variant='h1' {...props} />
export const H2 = (props:TTextEl) => <Text variant='h2' {...props} />
export const H3 = (props:TTextEl) => <Text variant='h3' {...props} />
export const H4 = (props:TTextEl) => <Text variant='h4' {...props} />
export const H5 = (props:TTextEl) => <Text variant='h5' {...props} />
export const H6 = (props:TTextEl) => <Text variant='h6' {...props} />
export const Paragraph = (props:TTextEl) => <Text component='p' {...props} />
export const Span = (props:TTextEl) => <Text component='span' {...props} />
export const Label = (props:TTextEl) => <Text component='label' {...props} />

export {
  Paragraph as P
}

